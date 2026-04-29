import { createBuilding } from "../../lib/actions/building";
import { BuildingForm } from "../building-form";

export default function Page() {
  return <BuildingForm mode="create" action={createBuilding} />;
}
