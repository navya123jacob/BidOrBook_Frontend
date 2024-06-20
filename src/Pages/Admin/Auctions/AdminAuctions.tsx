import Breadcrumb from '../AdminBreadcrumbs';
import DefaultLayout from '../../../Components/Admin/DefaultLayout';
import AuctionTable from '../../../Components/Admin/Tables/Auctions';


const AdminAuction = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Auctions" />

      <div className="flex flex-col gap-10">
        <AuctionTable/>
      </div>
    </DefaultLayout>
  );
};

export default AdminAuction;