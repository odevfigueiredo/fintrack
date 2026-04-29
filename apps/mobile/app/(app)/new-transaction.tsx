import { TransactionForm } from "@/components/transaction-form";
import { ScrollView, Text } from "@/tw";

export default function NewTransactionScreen() {
  return (
    <ScrollView className="flex-1 bg-ink-950" contentContainerClassName="gap-5 p-5 pb-10" contentInsetAdjustmentBehavior="automatic">
      <Text className="text-2xl font-semibold text-white">Nova transacao</Text>
      <TransactionForm />
    </ScrollView>
  );
}
