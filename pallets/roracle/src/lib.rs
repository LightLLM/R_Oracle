#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;

#[frame_support::pallet]
pub mod pallet {
    use codec::{Decode, Encode};
    use frame_support::{
        pallet_prelude::*,
        traits::Time,
    };
    use frame_system::pallet_prelude::*;
    use scale_info::TypeInfo;
    use sp_std::prelude::*;

    #[pallet::pallet]
    #[pallet::generate_store(pub(super) trait Store)]
    pub struct Pallet<T>(_);

    /// Configure the pallet by specifying the parameters and types on which it depends.
    #[pallet::config]
    pub trait Config: frame_system::Config {
        /// Because this pallet emits events, it depends on the runtime's definition of an event.
        type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
        
        /// The timestamp provider
        type TimeProvider: Time;
    }

    /// Oracle Value struct
    #[derive(Encode, Decode, Clone, PartialEq, Eq, RuntimeDebug, TypeInfo)]
    pub struct OracleValue {
        pub value: u128,
        pub source: Vec<u8>,
        pub updated_at: u64,
        pub status: Vec<u8>,
    }

    /// Storage: Last oracle value
    #[pallet::storage]
    #[pallet::getter(fn last_value)]
    pub type LastValue<T: Config> = StorageValue<_, OracleValue, OptionQuery>;

    /// Storage: History of oracle values
    #[pallet::storage]
    #[pallet::getter(fn history)]
    pub type History<T: Config> = StorageMap<
        _,
        Blake2_128Concat,
        u64,
        OracleValue,
        ValueQuery,
   >;

    /// Storage: History index counter
    #[pallet::storage]
    #[pallet::getter(fn history_index)]
    pub type HistoryIndex<T: Config> = StorageValue<_, u64, ValueQuery>;

    // Pallets use events to inform users when important changes are made.
    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        /// Oracle value was updated
        ValueUpdated {
            value: u128,
            source: Vec<u8>,
            updated_at: u64,
            status: Vec<u8>,
        },
    }

    // Errors inform users that something went wrong.
    #[pallet::error]
    pub enum Error<T> {
        /// Value is zero or invalid
        InvalidValue,
        /// Source is empty
        InvalidSource,
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        /// Submit a new oracle value
        #[pallet::weight(10_000)]
        #[pallet::call_index(0)]
        pub fn submit_oracle_value(
            origin: OriginFor<T>,
            value: u128,
            source: Vec<u8>,
            status: Vec<u8>,
        ) -> DispatchResult {
            let _who = ensure_signed(origin)?;

            // Validate inputs
            ensure!(value > 0, Error::<T>::InvalidValue);
            ensure!(!source.is_empty(), Error::<T>::InvalidSource);

            // Get current timestamp
            let updated_at = T::TimeProvider::now().as_secs();

            // Create oracle value
            let oracle_value = OracleValue {
                value,
                source: source.clone(),
                updated_at,
                status: status.clone(),
            };

            // Update last value
            LastValue::<T>::put(&oracle_value);

            // Add to history
            let index = HistoryIndex::<T>::get();
            History::<T>::insert(index, &oracle_value);
            HistoryIndex::<T>::put(index.saturating_add(1));

            // Emit event
            Self::deposit_event(Event::ValueUpdated {
                value,
                source,
                updated_at,
                status,
            });

            Ok(())
        }
    }

    #[pallet::genesis_config]
    pub struct GenesisConfig<T: Config> {
        pub _phantom: PhantomData<T>,
    }

    #[cfg(feature = "std")]
    impl<T: Config> Default for GenesisConfig<T> {
        fn default() -> Self {
            Self {
                _phantom: Default::default(),
            }
        }
    }

    #[pallet::genesis_build]
    impl<T: Config> GenesisBuild<T> for GenesisConfig<T> {
        fn build(&self) {
            HistoryIndex::<T>::put(0u64);
        }
    }
}

#[cfg(test)]
mod tests;

