
const SidebarNav = () => {

   return (
      <div><nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
         <div className="position-sticky pt-3 sidebar-sticky">
            <ul className="nav flex-column mx-3">
               <li className="nav-item">
                  <a className="btn-single d-inline-flex text-decoration-none rounded" href="https://superkabayan.herokuapp.com/dashboard">Dashboard</a>
               </li>
               <li className="border-top my-2"></li>
               <li className="nav-item">
                  <a className="btn-single d-inline-flex text-decoration-none rounded" href="https://superkabayan.herokuapp.com/savings">Savings</a>
               </li>
               <li className="nav-item">
                  <a className="btn-single d-inline-flex text-decoration-none rounded" href="https://superkabayan.herokuapp.com/payments">Payments</a>
               </li>
               <li className="border-top my-2"></li>
               <li className="nav-item">
                  <button className="btn-toggle d-inline-flex align-items-center rounded border-0 collapsed" data-bs-toggle="collapse" data-bs-target="#account-collapse" aria-expanded="false">
                  Upcoming Features
                  </button>
                  <div className="collapse" id="account-collapse">
                     <ul className="btn-toggle-nav list-unstyled fw-normal pb-4">
                     <li className="nav-item">
                  <a className="btn-single d-inline-flex text-decoration-none rounded disabled" href="https://superkabayan.herokuapp.com/development">Budget</a>
               </li>
               <li className="nav-item">
                  <a className="btn-single d-inline-flex text-decoration-none rounded" href="https://superkabayan.herokuapp.com/development">Masterclass</a>
               </li>
               <li className="nav-item">
                  <a className="btn-single d-inline-flex text-decoration-none rounded" href="https://superkabayan.herokuapp.com/development">Hotlines</a>
               </li>
                     </ul>
                  </div>
               </li>
            </ul>

         </div>
      </nav></div>
   )
}

export default SidebarNav