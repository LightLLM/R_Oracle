//! R-Oracle Node Entry Point

#![warn(missing_docs)]

mod chain_spec;
mod cli;
mod command;
mod service;

fn main() -> sc_cli::Result<()> {
    command::run()
}

