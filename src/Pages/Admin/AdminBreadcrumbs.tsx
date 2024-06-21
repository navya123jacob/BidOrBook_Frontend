import { Link } from 'react-router-dom';
import useColorMode from '../../Components/Admin/useColorMode';

interface BreadcrumbProps {
  pageName: string;
}

const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  const [colorMode] = useColorMode();

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" >
      <h2
        className='text-black dark:text-white'
      >
        {pageName}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link
              className={`font-medium ${
                colorMode === 'dark' ? 'text-gray-400' : 'text-gray-700'
              }`}
              to="/"
            >
              Admin /
            </Link>
          </li>
          <li
            className={`font-medium ${
              colorMode === 'dark' ? 'text-primary-dark' : 'text-graydark'
            }`}
          >
            {pageName}
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
