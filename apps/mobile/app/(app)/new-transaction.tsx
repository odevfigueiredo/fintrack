import { ScreenHeader, ScreenScroll } from "@/components/screen";
import { TransactionForm } from "@/components/transaction-form";

export default function NewTransactionScreen() {
  return (
    <ScreenScroll>
      <ScreenHeader
        title="Nova transacao"
        subtitle="Registre uma receita ou despesa. Se estiver offline, o app salva no SQLite local."
        badge="Lancamento"
      />
      <TransactionForm />
    </ScreenScroll>
  );
}
