import { CompanyDriverWallet, CompanyTransaction } from "@/services/companyWalletService";

const sampleDrivers: CompanyDriverWallet[] = [
  { driverId: "d1", fullName: "Abebe Bekele", balance: 1200, totalEarnings: 5400, phone: "0911223344", email: "abebe@example.com" },
  { driverId: "d2", fullName: "Selamawit Haile", balance: 450, totalEarnings: 3000, phone: "0911334455", email: "selamawit@example.com" },
  { driverId: "d3", fullName: "Kebede Tesfaye", balance: 0, totalEarnings: 1250, phone: "0911445566", email: "kebede@example.com" },
];

const sampleTxs: Record<string, CompanyTransaction[]> = {
  d1: [
    { _id: "tx1", trx_ref: "TRX-1001", amount: 2000, driverCommission: 1200, companyShare: 800, status: "COMPLETED", createdAt: new Date().toISOString(), ref_id: "trip1" },
    { _id: "tx2", trx_ref: "TRX-1005", amount: 1500, driverCommission: 1000, companyShare: 500, status: "COMPLETED", createdAt: new Date(Date.now()-86400000).toISOString(), ref_id: "trip4" },
  ],
  d2: [
    { _id: "tx3", trx_ref: "TRX-1010", amount: 500, driverCommission: 300, companyShare: 200, status: "COMPLETED", createdAt: new Date(Date.now()-3600*1000).toISOString(), ref_id: "trip7" },
  ],
  d3: [],
};

let sampleWithdrawals: any[] = [
  { _id: 'w1', driverId: 'd1', companyId: 'c1', requestedBy: 'duser1', amount: 500, note: 'Payout', status: 'PENDING', createdAt: new Date().toISOString() },
  { _id: 'w2', driverId: 'd2', companyId: 'c1', requestedBy: 'duser2', amount: 200, note: '', status: 'APPROVED', createdAt: new Date(Date.now()-86400000).toISOString() },
];

function delay<T>(value: T, ms = 300) {
  return new Promise<T>((res) => setTimeout(() => res(value), ms));
}

export async function getDriversWallets(): Promise<CompanyDriverWallet[]> {
  return delay(sampleDrivers);
}

export async function getDriverTransactions(driverId: string): Promise<CompanyTransaction[]> {
  return delay(sampleTxs[driverId] || []);
}

export async function requestWithdraw(driverId: string, payload: { amount: number; note?: string }) {
  // Simulate success and reduce balance in sample data
  const driver = sampleDrivers.find((d) => d.driverId === driverId);
  if (driver) driver.balance = Math.max(0, driver.balance - (payload.amount || 0));
  const newW = { _id: `w${Date.now()}`, driverId, companyId: 'c1', requestedBy: `u-${driverId}`, amount: payload.amount, note: payload.note || '', status: 'PENDING', createdAt: new Date().toISOString() };
  sampleWithdrawals.unshift(newW);
  return delay({ status: "success", message: "Withdraw request created", data: newW }, 200);
}

export async function approveWithdraw(withdrawalId: string) {
  const w = sampleWithdrawals.find((x) => x._id === withdrawalId);
  if (w) {
    w.status = 'APPROVED';
    w.processedAt = new Date().toISOString();
  }
  return delay({ status: "success", message: "Withdrawal approved", data: w }, 200);
}

export async function getWithdrawals() {
  return delay(sampleWithdrawals);
}
