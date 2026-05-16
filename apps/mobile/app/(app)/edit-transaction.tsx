import { useLocalSearchParams } from "expo-router";
import { ScreenHeader, ScreenScroll } from "@/components/screen";
import { TransactionForm } from "@/components/transaction-form";

export default function EditTransactionScreen() {
  const params = useLocalSearchParams<{ id?: string }>();

  return (
    <ScreenScroll>
      <ScreenHeader
        title="Editar transacao"
        subtitle="Ajuste valor, categoria, data ou descricao mantendo o historico organizado."
        badge="Revisao"
      />
      <TransactionForm transactionId={params.id} />
    </ScreenScroll>
  );
}
