# Testing Guide

This document describes the testing strategy and how to run tests for R-Oracle.

## Test Structure

### Pallet Tests (Rust)

Located in `pallets/roracle/src/tests.rs`, these tests cover:

- **Genesis Configuration**: Verifies initial state
- **Extrinsic Tests**: Tests `submit_oracle_value` with various scenarios
- **Storage Tests**: Verifies `LastValue` and `History` storage
- **Error Handling**: Tests validation and error cases
- **Edge Cases**: Large values, long strings, overflow scenarios

### Frontend Tests (TypeScript/Jest)

Located in `frontend/src/**/__tests__/`, these tests cover:

- **Oracle Price Fetching**: Tests failover logic (Binance → Coinbase → Kraken)
- **API Connection**: Tests RPC connection and failover
- **Pallet Interactions**: Tests chain interaction functions
- **UI Components**: Tests React components

## Running Tests

### Pallet Tests

```bash
# Run all pallet tests
cargo test -p pallet-roracle

# Run with output
cargo test -p pallet-roracle -- --nocapture

# Run specific test
cargo test -p pallet-roracle test_submit_oracle_value_success
```

### Frontend Tests

```bash
cd frontend

# Install dependencies (if not already done)
npm install

# Run all tests
npm test

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

## Test Coverage

### Pallet Coverage

- ✅ Genesis configuration
- ✅ Successful value submission
- ✅ Invalid value (zero) rejection
- ✅ Invalid source (empty) rejection
- ✅ Unsigned origin rejection
- ✅ Multiple submissions
- ✅ Different sources (Binance, Coinbase, Kraken)
- ✅ Different statuses (success, warning, error)
- ✅ Large values (u128::MAX)
- ✅ Long source strings
- ✅ History index overflow protection

### Frontend Coverage

- ✅ Oracle price fetching from Binance
- ✅ Failover to Coinbase
- ✅ Failover to Kraken
- ✅ All sources fail handling
- ✅ API connection management
- ✅ RPC failover
- ✅ Last value retrieval
- ✅ History retrieval
- ✅ Value submission
- ✅ Dashboard component rendering
- ✅ Submit button interactions
- ✅ History chart rendering

## Writing New Tests

### Adding Pallet Tests

1. Add test function to `pallets/roracle/src/tests.rs`
2. Use `new_test_ext()` to create test environment
3. Use `assert_ok!` and `assert_err!` for assertions
4. Use `system::Pallet::<Test>::assert_has_event` for event testing

Example:
```rust
#[test]
fn test_my_feature() {
    new_test_ext().execute_with(|| {
        // Test code here
        assert_ok!(Roracle::my_function(RuntimeOrigin::signed(1)));
    });
}
```

### Adding Frontend Tests

1. Create test file: `frontend/src/path/to/__tests__/file.test.ts`
2. Import testing utilities
3. Mock external dependencies
4. Write test cases

Example:
```typescript
import { myFunction } from '../myModule';

describe('myFunction', () => {
  it('should do something', () => {
    const result = myFunction();
    expect(result).toBe(expected);
  });
});
```

## Continuous Integration

Tests should be run in CI/CD pipeline:

```yaml
# Example GitHub Actions
- name: Test Pallet
  run: cargo test -p pallet-roracle

- name: Test Frontend
  run: |
    cd frontend
    npm install
    npm test
```

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Clear Names**: Test names should describe what they test
3. **Arrange-Act-Assert**: Structure tests clearly
4. **Mock External Dependencies**: Don't make real API calls in tests
5. **Cover Edge Cases**: Test error conditions and boundaries
6. **Maintain Tests**: Update tests when code changes

## Troubleshooting

### Pallet Tests Fail

- Check that mock runtime is properly configured
- Verify test externalities are set up correctly
- Ensure all dependencies are available

### Frontend Tests Fail

- Clear Jest cache: `npm test -- --clearCache`
- Check that mocks are properly set up
- Verify TypeScript types are correct

## Coverage Goals

- **Pallet**: 100% line coverage
- **Frontend**: 80%+ line coverage
- **Critical Paths**: 100% coverage

