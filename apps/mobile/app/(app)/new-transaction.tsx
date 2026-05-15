import { ScreenScroll } from "@/components/screen";
import { TransactionForm } from "@/components/transaction-form";
import { Text } from "@/tw";

export default function NewTransactionScreen() {
  return (
    <ScreenScroll>
      <Text className="text-2xl font-semibold text-white">Nova transacao</Text>
      <TransactionForm />
    </ScreenScroll>
  );
}
