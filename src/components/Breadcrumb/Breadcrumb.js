import React from 'react';
import { Route, Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import routes from '../../routes';
// import GlobStore from '../../views/Users/GlobStore';
import ExStore from '../../views/ViewUsers/ExStore';
const findRouteName = url => routes[url];

const getPaths = (pathname) => {
  const paths = ['/'];

  if (pathname === '/') return paths;

  pathname.split('/').reduce((prev, curr, index) => {
    // console.log(curr);
    const currPath = `${prev}/${curr}`;
    paths.push(currPath);
    return currPath;
  });
  return paths;
};

const BreadcrumbsItem = ({ ...rest, match }) => {
  const routeName = findRouteName(match.url);
  if (routeName) {
    // console.log("routeNmae",routeName);
     var data=ExStore.username+" / Orders";
    //  console.log(data);
     
    return (
      match.isExact ?
        ( 
          <BreadcrumbItem active>{routeName=='Quotations'?data:routeName}</BreadcrumbItem>
        ) :
        ( 
          <BreadcrumbItem>
            <Link to={match.url || ''}>
            {routeName}
            </Link>
          </BreadcrumbItem>
        )
    );
  }
  return null;
};

const Breadcrumbs = ({ ...rest, location: { pathname }, match }) => {
  const paths = getPaths(pathname);
  const items = paths.map((path, i) => {
    // console.log(path);
    return (
      <Route key={i++} path={path} component={BreadcrumbsItem} />
    )
  });
   
  return (
    <Breadcrumb>
      {items}
    </Breadcrumb>
  );
};

export default props => (
  <div>
    <Route path="/:path" component={Breadcrumbs} {...props} />
  </div>
);
