import Breadcrumb from '../AdminBreadcrumbs';
import DefaultLayout from '../../../Components/Admin/DefaultLayout';
import BookingsTable from '../../../Components/Admin/Tables/Bookings';


const AdminBookings = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Bookings" />

      <div className="flex flex-col gap-10">
        <BookingsTable/>
      </div>
    </DefaultLayout>
  );
};

export default AdminBookings;