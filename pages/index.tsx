import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function Index() {
  const router = useRouter();

  useEffect(() => {
    router.push('/home');
  }, []);

  return null;
}

export default Index;
