import Breadcrumb from '../AdminBreadcrumbs';
import DefaultLayout from '../../../Components/Admin/DefaultLayout';
import ChatsAdmin from '../../../Components/Admin/Tables/ChatsAdmin';



const AdminChats = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Auctions" />

      <div className="flex flex-col  gap-10  ">
        <ChatsAdmin/>
      </div>
    </DefaultLayout>
  );
};

export default AdminChats;