import { createStaff } from "../../lib/actions/staff";
import { StaffForm } from "../staff-form";

export default function Page() {
  return <StaffForm mode="create" action={createStaff} />;
}
