import { createContract } from "../../lib/actions/contract";
import { ContractForm } from "../contract-form";

export default function Page() {
  return <ContractForm mode="create" action={createContract} />;
}
