import { useLocalSearchParams } from "expo-router";
import { ScreenScroll } from "@/components/screen";
import { TransactionForm } from "@/components/transaction-form";
import { Text } from "@/tw";

export default function EditTransactionScreen() {
  const params = useLocalSearchParams<{ id?: string }>();

  return (
    <ScreenScroll>
      <Text className="text-2xl font-semibold text-white">Editar transacao</Text>
      <TransactionForm transactionId={params.id} />
    </ScreenScroll>
  );
}
