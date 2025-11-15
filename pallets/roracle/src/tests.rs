#![cfg(test)]

use super::*;
use crate::pallet::*;
use frame_support::{
    assert_err, assert_ok,
    traits::{ConstU64, GenesisBuild},
};
use frame_system as system;
use sp_core::H256;
use sp_runtime::{
    traits::{BlakeTwo256, IdentityLookup},
    BuildStorage,
};
use sp_std::marker::PhantomData;

type Block = frame_system::mocking::MockBlock<Test>;

// Configure a mock runtime to test the pallet.
frame_support::construct_runtime!(
    pub enum Test
    {
        System: frame_system,
        Roracle: pallet_roracle,
    }
);

impl system::Config for Test {
    type BaseCallFilter = frame_support::traits::Everything;
    type BlockWeights = ();
    type BlockLength = ();
    type DbWeight = ();
    type RuntimeOrigin = RuntimeOrigin;
    type RuntimeCall = RuntimeCall;
    type Nonce = u64;
    type Hash = H256;
    type Hashing = BlakeTwo256;
    type AccountId = u64;
    type Lookup = IdentityLookup<Self::AccountId>;
    type Block = Block;
    type RuntimeEvent = RuntimeEvent;
    type BlockHashCount = ConstU64<250>;
    type Version = ();
    type PalletInfo = PalletInfo;
    type AccountData = ();
    type OnNewAccount = ();
    type OnKilledAccount = ();
    type SystemWeightInfo = ();
    type SS58Prefix = ();
    type OnSetCode = ();
    type MaxConsumers = frame_support::traits::ConstU32<16>;
}

pub struct MockTimeProvider;
impl frame_support::traits::Time for MockTimeProvider {
    type Moment = u64;

    fn now() -> Self::Moment {
        1000 // Mock timestamp
    }
}

impl pallet_roracle::Config for Test {
    type RuntimeEvent = RuntimeEvent;
    type TimeProvider = MockTimeProvider;
}

// Build genesis storage according to the mock runtime.
pub fn new_test_ext() -> sp_io::TestExternalities {
    let mut storage = system::GenesisConfig::<Test>::default()
        .build_storage()
        .unwrap();

    let genesis_config = pallet_roracle::GenesisConfig::<Test> {
        _phantom: PhantomData,
    };
    genesis_config.assimilate_storage(&mut storage).unwrap();

    storage.into()
}

#[test]
fn test_genesis_config() {
    new_test_ext().execute_with(|| {
        // Check that history index is initialized to 0
        assert_eq!(Roracle::history_index(), 0);
        // Check that last value is None initially
        assert!(Roracle::last_value().is_none());
    });
}

#[test]
fn test_submit_oracle_value_success() {
    new_test_ext().execute_with(|| {
        let account_id = 1;
        let value = 50000 * 1_000_000_000_000u128; // 50k with 12 decimals
        let source = b"Binance".to_vec();
        let status = b"success".to_vec();

        // Submit oracle value
        assert_ok!(Roracle::submit_oracle_value(
            RuntimeOrigin::signed(account_id),
            value,
            source.clone(),
            status.clone()
        ));

        // Check last value
        let last_value = Roracle::last_value().unwrap();
        assert_eq!(last_value.value, value);
        assert_eq!(last_value.source, source);
        assert_eq!(last_value.status, status);
        assert_eq!(last_value.updated_at, 1000); // Mock timestamp

        // Check history
        let history_entry = Roracle::history(0);
        assert_eq!(history_entry.value, value);
        assert_eq!(history_entry.source, source);
        assert_eq!(history_entry.status, status);

        // Check history index incremented
        assert_eq!(Roracle::history_index(), 1);

        // Check event was emitted
        system::Pallet::<Test>::assert_has_event(
            RuntimeEvent::Roracle(pallet_roracle::Event::ValueUpdated {
                value,
                source: source.clone(),
                updated_at: 1000,
                status: status.clone(),
            })
            .into(),
        );
    });
}

#[test]
fn test_submit_oracle_value_invalid_value_zero() {
    new_test_ext().execute_with(|| {
        let account_id = 1;
        let value = 0u128; // Invalid: zero value
        let source = b"Binance".to_vec();
        let status = b"success".to_vec();

        // Should fail with InvalidValue error
        assert_err!(
            Roracle::submit_oracle_value(
                RuntimeOrigin::signed(account_id),
                value,
                source,
                status
            ),
            pallet_roracle::Error::<Test>::InvalidValue
        );

        // Check that nothing was stored
        assert!(Roracle::last_value().is_none());
        assert_eq!(Roracle::history_index(), 0);
    });
}

#[test]
fn test_submit_oracle_value_invalid_source_empty() {
    new_test_ext().execute_with(|| {
        let account_id = 1;
        let value = 50000 * 1_000_000_000_000u128;
        let source = vec![]; // Invalid: empty source
        let status = b"success".to_vec();

        // Should fail with InvalidSource error
        assert_err!(
            Roracle::submit_oracle_value(
                RuntimeOrigin::signed(account_id),
                value,
                source,
                status
            ),
            pallet_roracle::Error::<Test>::InvalidSource
        );

        // Check that nothing was stored
        assert!(Roracle::last_value().is_none());
        assert_eq!(Roracle::history_index(), 0);
    });
}

#[test]
fn test_submit_oracle_value_requires_signed() {
    new_test_ext().execute_with(|| {
        let value = 50000 * 1_000_000_000_000u128;
        let source = b"Binance".to_vec();
        let status = b"success".to_vec();

        // Should fail with BadOrigin
        assert_err!(
            Roracle::submit_oracle_value(
                RuntimeOrigin::none(),
                value,
                source,
                status
            ),
            sp_runtime::DispatchError::BadOrigin
        );
    });
}

#[test]
fn test_multiple_submissions() {
    new_test_ext().execute_with(|| {
        let account_id = 1;

        // Submit first value
        assert_ok!(Roracle::submit_oracle_value(
            RuntimeOrigin::signed(account_id),
            50000 * 1_000_000_000_000u128,
            b"Binance".to_vec(),
            b"success".to_vec()
        ));

        // Submit second value
        assert_ok!(Roracle::submit_oracle_value(
            RuntimeOrigin::signed(account_id),
            51000 * 1_000_000_000_000u128,
            b"Coinbase".to_vec(),
            b"success".to_vec()
        ));

        // Check last value is the second one
        let last_value = Roracle::last_value().unwrap();
        assert_eq!(last_value.value, 51000 * 1_000_000_000_000u128);
        assert_eq!(last_value.source, b"Coinbase".to_vec());

        // Check history has both entries
        let history_0 = Roracle::history(0);
        assert_eq!(history_0.value, 50000 * 1_000_000_000_000u128);
        assert_eq!(history_0.source, b"Binance".to_vec());

        let history_1 = Roracle::history(1);
        assert_eq!(history_1.value, 51000 * 1_000_000_000_000u128);
        assert_eq!(history_1.source, b"Coinbase".to_vec());

        // Check history index
        assert_eq!(Roracle::history_index(), 2);
    });
}

#[test]
fn test_different_sources() {
    new_test_ext().execute_with(|| {
        let account_id = 1;

        // Test Binance
        assert_ok!(Roracle::submit_oracle_value(
            RuntimeOrigin::signed(account_id),
            50000 * 1_000_000_000_000u128,
            b"Binance".to_vec(),
            b"success".to_vec()
        ));

        // Test Coinbase
        assert_ok!(Roracle::submit_oracle_value(
            RuntimeOrigin::signed(account_id),
            51000 * 1_000_000_000_000u128,
            b"Coinbase".to_vec(),
            b"success".to_vec()
        ));

        // Test Kraken
        assert_ok!(Roracle::submit_oracle_value(
            RuntimeOrigin::signed(account_id),
            52000 * 1_000_000_000_000u128,
            b"Kraken".to_vec(),
            b"success".to_vec()
        ));

        // Verify all sources are stored correctly
        assert_eq!(Roracle::history(0).source, b"Binance".to_vec());
        assert_eq!(Roracle::history(1).source, b"Coinbase".to_vec());
        assert_eq!(Roracle::history(2).source, b"Kraken".to_vec());
    });
}

#[test]
fn test_different_statuses() {
    new_test_ext().execute_with(|| {
        let account_id = 1;

        // Test success status
        assert_ok!(Roracle::submit_oracle_value(
            RuntimeOrigin::signed(account_id),
            50000 * 1_000_000_000_000u128,
            b"Binance".to_vec(),
            b"success".to_vec()
        ));

        // Test warning status
        assert_ok!(Roracle::submit_oracle_value(
            RuntimeOrigin::signed(account_id),
            51000 * 1_000_000_000_000u128,
            b"Coinbase".to_vec(),
            b"warning".to_vec()
        ));

        // Test error status
        assert_ok!(Roracle::submit_oracle_value(
            RuntimeOrigin::signed(account_id),
            52000 * 1_000_000_000_000u128,
            b"Kraken".to_vec(),
            b"error".to_vec()
        ));

        // Verify all statuses are stored correctly
        assert_eq!(Roracle::history(0).status, b"success".to_vec());
        assert_eq!(Roracle::history(1).status, b"warning".to_vec());
        assert_eq!(Roracle::history(2).status, b"error".to_vec());
    });
}

#[test]
fn test_large_values() {
    new_test_ext().execute_with(|| {
        let account_id = 1;
        let large_value = u128::MAX;

        assert_ok!(Roracle::submit_oracle_value(
            RuntimeOrigin::signed(account_id),
            large_value,
            b"Binance".to_vec(),
            b"success".to_vec()
        ));

        let last_value = Roracle::last_value().unwrap();
        assert_eq!(last_value.value, large_value);
    });
}

#[test]
fn test_long_source_string() {
    new_test_ext().execute_with(|| {
        let account_id = 1;
        let long_source = b"A very long source name that exceeds normal length".to_vec();

        assert_ok!(Roracle::submit_oracle_value(
            RuntimeOrigin::signed(account_id),
            50000 * 1_000_000_000_000u128,
            long_source.clone(),
            b"success".to_vec()
        ));

        let last_value = Roracle::last_value().unwrap();
        assert_eq!(last_value.source, long_source);
    });
}

#[test]
fn test_history_index_overflow() {
    new_test_ext().execute_with(|| {
        let account_id = 1;

        // Set history index to near max
        HistoryIndex::<Test>::put(u64::MAX - 1);

        // Submit value
        assert_ok!(Roracle::submit_oracle_value(
            RuntimeOrigin::signed(account_id),
            50000 * 1_000_000_000_000u128,
            b"Binance".to_vec(),
            b"success".to_vec()
        ));

        // Check that index saturates at max
        assert_eq!(Roracle::history_index(), u64::MAX);
    });
}

