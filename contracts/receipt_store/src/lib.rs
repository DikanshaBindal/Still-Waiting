#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String};

#[contracttype]
#[derive(Clone)]
pub struct Receipt {
    pub receipt_id: String,
    pub wallet: Address,
    pub amount: i128,
    pub timestamp: u64,
}

#[contract]
pub struct ReceiptStoreContract;

#[contractimpl]
impl ReceiptStoreContract {
    pub fn create_receipt(
        env: Env,
        receipt_id: String,
        wallet: Address,
        amount: i128,
        timestamp: u64,
    ) {
        let receipt = Receipt {
            receipt_id: receipt_id.clone(),
            wallet,
            amount,
            timestamp,
        };
        env.storage().persistent().set(&receipt_id, &receipt);
    }
}
