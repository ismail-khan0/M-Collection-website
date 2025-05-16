import SignupForm from '@/Components/SignupForm';
import { getServerSession } from 'next-auth';
import {redirect} from 'next/navigation'
import { authOptions } from '../../auth.config';

export default async function SignupPage() {
  const session=await getServerSession(authOptions)
  if(session) redirect("/")
  return <SignupForm/>;
}
