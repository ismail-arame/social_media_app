import { useEffect } from 'react';

import Header from '../components/header';
import Timeline from '../components/timeline';

// => '../components/sidebar/index' but index is the entry point so react knows that already without needing to write it
import Sidebar from '../components/sidebar';

export default function Dashboard() {
  useEffect(() => {
    document.title = 'Instagram';
  }, []);

  return (
    <div className="bg-gray-background " id="container">
      <Header />
      <div className="grid grid-cols-3 gap-4 mx-auto max-w-screen-lg justify-between px-10">
        <Timeline />
        <Sidebar />
      </div>
    </div>
  );
}
