//! Service and executor for R-Oracle Node
//! Simplified service implementation

use r_oracle_runtime::{opaque::Block, RuntimeApi};
use sc_client_api::Backend;
use sc_executor::NativeElseWasmExecutor;
use sc_service::{Configuration, PartialComponents, TFullBackend, TFullClient, TaskManager};

/// Native executor type.
pub struct ExecutorDispatch;

impl sc_executor::NativeExecutionDispatch for ExecutorDispatch {
    type ExtendHostFunctions = ();

    fn dispatch(method: &str, data: &[u8]) -> Option<Vec<u8>> {
        r_oracle_runtime::api::dispatch(method, data)
    }

    fn native_version() -> sc_executor::NativeVersion {
        r_oracle_runtime::native_version()
    }
}

type FullClient = TFullClient<Block, RuntimeApi, NativeElseWasmExecutor<ExecutorDispatch>>;
type FullBackend = TFullBackend<Block>;

/// Build a new partial service.
pub fn new_partial(
    config: &Configuration,
) -> Result<
    PartialComponents<
        FullClient,
        FullBackend,
        (),
        sc_consensus::DefaultImportQueue<Block>,
        sc_transaction_pool::FullPool<Block, FullClient>,
        (),
    >,
    sc_service::Error,
> {
    let (client, backend, keystore_container, task_manager, import_queue, transaction_pool, _) =
        sc_service::new_full_parts::<Block, RuntimeApi, _>(config, None)?;

    Ok(PartialComponents {
        backend,
        client,
        import_queue,
        keystore_container,
        select_chain: (),
        task_manager,
        transaction_pool,
        other: (),
    })
}

/// Build a new service for a full client.
pub fn new_full(config: Configuration) -> Result<TaskManager, sc_service::Error> {
    let (client, backend, _keystore_container, task_manager) =
        sc_service::new_full_parts::<Block, RuntimeApi, _>(config, None)?;

    let _client = sc_service::FullClient::new(client, backend, task_manager.spawn_handle());

    Ok(task_manager)
}
