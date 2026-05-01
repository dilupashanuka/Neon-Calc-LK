import { redirect } from 'next/navigation';

// Old admin route - redirects to secure /mahima portal
export default function AdminPage() {
  redirect('/mahima');
}
