import { createStudent } from "../../lib/actions/student";
import { StudentForm } from "../student-form";

export default function Page() {
  return <StudentForm mode="create" action={createStudent} />;
}
