import { Fragment, useEffect, useState } from 'react'
import HeaderDoctor from '../../components/HeaderDoctor'
import useBootstrap from '../../hooks/useBootstrap';
import Sidebar from '../../components/doctordash/Sidebar';
import ContentDoctorDash from './../../components/doctordash/ContentDoctorDash';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
export default function DoctorDashboard() {
  useBootstrap();
  const [sidebarOpen, setsidebarOpen] = useState(false);
  const [doctorData, setDoctorData] = useState([]);

  const toggleSidebar = () => {
    setsidebarOpen(!sidebarOpen)
  }

  //get doctor data from firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.role === 'doctor') {
            setDoctorData(data);
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <Fragment>
      <HeaderDoctor toggleSidebar={toggleSidebar}  doctorData={doctorData} />
      <div className='d-flex'>
        <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar}  />
        <ContentDoctorDash  />
      </div>

    </Fragment>
  )
}
