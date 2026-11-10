import { formatMoney, newId } from "@wito/shared";

export default function App() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Wito</h1>
      <p>Un pedido de ejemplo: {formatMoney(123450)}</p>
      <p>ID de prueba: {newId()}</p>
    </div>
  );
}
