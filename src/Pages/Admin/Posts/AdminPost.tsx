import Breadcrumb from '../AdminBreadcrumbs';
import DefaultLayout from '../../../Components/Admin/DefaultLayout';
import PostTable from '../../../Components/Admin/Tables/Posts';

const AdminPost = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Posts" />

      <div className="flex flex-col gap-10">
        <PostTable/>
      </div>
    </DefaultLayout>
  );
};

export default AdminPost;