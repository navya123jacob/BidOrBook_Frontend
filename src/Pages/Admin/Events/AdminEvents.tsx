import Breadcrumb from '../AdminBreadcrumbs';
import DefaultLayout from '../../../Components/Admin/DefaultLayout';
import EventsTable from '../../../Components/Admin/Tables/EventsTable';


const AdminEvents = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Bookings" />

      <div className="flex flex-col gap-10">
        <EventsTable/>
      </div>
    </DefaultLayout>
  );
};

export default AdminEvents;