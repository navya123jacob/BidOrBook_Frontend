import Breadcrumb from '../AdminBreadcrumbs';
import TableThree from '../../../Components/Admin/Tables/Tablethree';
import DefaultLayout from '../../../Components/Admin/DefaultLayout';

const Tables = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Users" />

      <div className="flex flex-col gap-10">
        
        <TableThree />
      </div>
    </DefaultLayout>
  );
};

export default Tables;