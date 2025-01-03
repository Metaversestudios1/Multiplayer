import "./App.css";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PrivateRoute from "./components/utils/PrivateRoute";
import Home from "./components/Home";
import AviatorSetting from "./components/setting/aviator/AviatorSetting";
import Login from "./components/Login";
import Error from "./components/Error";
import AviatorNew from "./components/AviatorNew";
import AuthProvider from "./context/AuthContext";
import BankDetails from "./components/setting/BankDetails/bankdetail";
import RechargeHistory from "./components/setting/rechargehistory";
import WithdrawHistory from "./components/setting/withdrawhistory";

import AddCrashPercentage from "./components/crashPercent/AddCrashPercentage";
import CrashPercentage from "./components/crashPercent/CrashPercentage";
import EditCrashPercentage from "./components/crashPercent/EditCrashPercentage";
import User from "./components/User/User";
import KYCUser from "./components/KYCUser/kycuser";
import Request from "./components/Request";
import ShowUser from "./components/User/ShowUser";
import PromocodeSetting from "./components/setting/promocode/PromocodeSetting";
import Bankdetailskyc from "./components/KYCUser/bankdetailskyc";
import Withdrawdashboard from "./components/withdraw/withdrawdashboard";
import Aviatorhistory from "./components/Aviator/aviatorhistory";

//new component added
import AddUser from "./components/User/AddUser";
import EditUser from "./components/User/EditUser";
import SendMailSms from "./components/User/UserSendMailSMS";
import UserVerifyMailSMS from "./components/User/UserVerifyMailSMS";
import Banner from "./components/setting/banner/Banner";
import AddBanner from "./components/setting/banner/AddBanner";
import AddWallet from "./components/User/AddWallet";
import RemoveWallet from "./components/User/RemoveWallet";

function App() {
  const [sideBar, setSideBar] = useState(true);
  const toggleSideBar = () => {
    setSideBar(!sideBar);
  };
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div>
          <Login />
        </div>
      ),
    },

    {
      path: "/login",
      element: (
        <div>
          <Login />
        </div>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <PrivateRoute>
          <div className="flex h-screen">
            <Sidebar
              sidebar={sideBar}
              className="flex-1"
              toggleSideBar={toggleSideBar}
            />
            <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
              <Navbar toggleSideBar={toggleSideBar} />
              <Home />
            </div>
          </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/aviatorsetting",
      element: (
        <PrivateRoute>
          <div className="flex h-screen">
            <Sidebar
              sidebar={sideBar}
              className="flex-1"
              toggleSideBar={toggleSideBar}
            />
            <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
              <Navbar toggleSideBar={toggleSideBar} />
              <AviatorSetting />
            </div>
          </div>
        </PrivateRoute>
      ),
    },

    {
      path: "/aviatornew",
      element: <AviatorNew />,
    },
    {
      path: "/bankdetails",
      element: (
        <PrivateRoute>
          <div className="flex h-screen">
            <Sidebar
              sidebar={sideBar}
              className="flex-1"
              toggleSideBar={toggleSideBar}
            />
            <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
              <Navbar toggleSideBar={toggleSideBar} />
              <BankDetails />
            </div>
          </div>
        </PrivateRoute>
      ),
    },

    {
      path: "/rechargehistory",
      element: (
        <PrivateRoute>
          <div className="flex h-screen">
            <Sidebar
              sidebar={sideBar}
              className="flex-1"
              toggleSideBar={toggleSideBar}
            />
            <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
              <Navbar toggleSideBar={toggleSideBar} />
              <RechargeHistory />
            </div>
          </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/rechargehistory/:id",
      element: (
        <PrivateRoute>
          <div className="flex h-screen">
            <Sidebar
              sidebar={sideBar}
              className="flex-1"
              toggleSideBar={toggleSideBar}
            />
            <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
              <Navbar toggleSideBar={toggleSideBar} />
              <RechargeHistory />
            </div>
          </div>
        </PrivateRoute>
      ),
    },
    // {
    //   path: "/rechargehistory/:id",
    //   element: (
    //     <PrivateRoute>
    //       <div className="flex h-screen">
    //         <Sidebar
    //           sidebar={sideBar}
    //           className="flex-1"
    //           toggleSideBar={toggleSideBar}
    //         />
    //         <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
    //           <Navbar toggleSideBar={toggleSideBar} />
    //           <RechargeHistory />
    //         </div>
    //       </div>
    //     </PrivateRoute>
    //   ),
    // },
    {
      path: "/withdrawhistory",
      element: (
        <PrivateRoute>
          <div className="flex h-screen">
            <Sidebar
              sidebar={sideBar}
              className="flex-1"
              toggleSideBar={toggleSideBar}
            />
            <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
              <Navbar toggleSideBar={toggleSideBar} />
              <WithdrawHistory />
            </div>
          </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/withdrawhistory/:id",
      element: (
        <PrivateRoute>
          <div className="flex h-screen">
            <Sidebar
              sidebar={sideBar}
              className="flex-1"
              toggleSideBar={toggleSideBar}
            />
            <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
              <Navbar toggleSideBar={toggleSideBar} />
              <WithdrawHistory />
            </div>
          </div>
        </PrivateRoute>
      ),
    },

    {
      path: "/addcrashpercentage",
      element: (
        <PrivateRoute>
          <div className="flex h-screen">
            <Sidebar
              sidebar={sideBar}
              className="flex-1"
              toggleSideBar={toggleSideBar}
            />
            <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
              <Navbar toggleSideBar={toggleSideBar} />
              <AddCrashPercentage />
            </div>
          </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/crashpercentage",
      element: (
        <PrivateRoute>
          <div className="flex h-screen">
            <Sidebar
              sidebar={sideBar}
              className="flex-1"
              toggleSideBar={toggleSideBar}
            />
            <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
              <Navbar toggleSideBar={toggleSideBar} />
              <CrashPercentage />
            </div>
          </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/editcrashpercentage/:id",
      element: (
        <PrivateRoute>
          <div className="flex h-screen">
            <Sidebar
              sidebar={sideBar}
              className="flex-1"
              toggleSideBar={toggleSideBar}
            />
            <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
              <Navbar toggleSideBar={toggleSideBar} />
              <EditCrashPercentage />
            </div>
          </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/usersendmailsms",
      element: (
        <PrivateRoute>
          <div className="flex h-screen">
            <Sidebar
              sidebar={sideBar}
              className="flex-1"
              toggleSideBar={toggleSideBar}
            />
            <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
              <Navbar toggleSideBar={toggleSideBar} />
              <SendMailSms />
            </div>
          </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/userverifymailsms",
      element: (
        <PrivateRoute>
          <div className="flex h-screen">
            <Sidebar
              sidebar={sideBar}
              className="flex-1"
              toggleSideBar={toggleSideBar}
            />
            <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
              <Navbar toggleSideBar={toggleSideBar} />
              <UserVerifyMailSMS />
            </div>
          </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/adduser",
      element: (
        <PrivateRoute>
          <div className="flex h-screen">
            <Sidebar
              sidebar={sideBar}
              className="flex-1"
              toggleSideBar={toggleSideBar}
            />
            <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
              <Navbar toggleSideBar={toggleSideBar} />
              <AddUser />
            </div>
          </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/users",
      element: (
        <PrivateRoute>
          <div className="flex h-screen">
            <Sidebar
              sidebar={sideBar}
              className="flex-1"
              toggleSideBar={toggleSideBar}
            />
            <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
              <Navbar toggleSideBar={toggleSideBar} />
              <User />
            </div>
          </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/edituser/:id",
      element: (
        <div className="flex h-screen">
          <Sidebar
            sidebar={sideBar}
            className="flex-1"
            toggleSideBar={toggleSideBar}
          />
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <EditUser />
          </div>
        </div>
      ),
    },
    {
      path: "/addwalletuser/:id",
      element: (
        <div className="flex h-screen">
          <Sidebar
            sidebar={sideBar}
            className="flex-1"
            toggleSideBar={toggleSideBar}
          />
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <AddWallet />
          </div>
        </div>
      ),
    },
    {
      path: "/removewalletuser/:id",
      element: (
        <div className="flex h-screen">
          <Sidebar
            sidebar={sideBar}
            className="flex-1"
            toggleSideBar={toggleSideBar}
          />
          <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
            <Navbar toggleSideBar={toggleSideBar} />
            <RemoveWallet />
          </div>
        </div>
      ),
    },
    {
      path: "/kycusers",
      element: (
        <PrivateRoute>
          <div className="flex h-screen">
            <Sidebar
              sidebar={sideBar}
              className="flex-1"
              toggleSideBar={toggleSideBar}
            />
            <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
              <Navbar toggleSideBar={toggleSideBar} />
              <KYCUser />
            </div>
          </div>
        </PrivateRoute>
      ),
    },

    {
      path: "/kycusers/:id",
      element: (
        <PrivateRoute>
          <div className="flex h-screen">
            <Sidebar
              sidebar={sideBar}
              className="flex-1"
              toggleSideBar={toggleSideBar}
            />
            <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
              <Navbar toggleSideBar={toggleSideBar} />
              <KYCUser />
            </div>
          </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/bankdetailskyc",
      element: (
        <PrivateRoute>
          <div className="flex h-screen">
            <Sidebar
              sidebar={sideBar}
              className="flex-1"
              toggleSideBar={toggleSideBar}
            />
            <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
              <Navbar toggleSideBar={toggleSideBar} />
              <Bankdetailskyc />
            </div>
          </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/request",
      element: (
        <PrivateRoute>
          <div className="flex h-screen">
            <Sidebar
              sidebar={sideBar}
              className="flex-1"
              toggleSideBar={toggleSideBar}
            />
            <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
              <Navbar toggleSideBar={toggleSideBar} />
              <Request />
            </div>
          </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/promocodesetting",
      element: (
        <PrivateRoute>
          <div className="flex h-screen">
            <Sidebar
              sidebar={sideBar}
              className="flex-1"
              toggleSideBar={toggleSideBar}
            />
            <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
              <Navbar toggleSideBar={toggleSideBar} />
              <PromocodeSetting />
            </div>
          </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/withdrawdashboard",
      element: (
        <PrivateRoute>
          <div className="flex h-screen">
            <Sidebar
              sidebar={sideBar}
              className="flex-1"
              toggleSideBar={toggleSideBar}
            />
            <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
              <Navbar toggleSideBar={toggleSideBar} />
              <Withdrawdashboard />
            </div>
          </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/aviatorhistory",
      element: (
        <PrivateRoute>
          <div className="flex h-screen">
            <Sidebar
              sidebar={sideBar}
              className="flex-1"
              toggleSideBar={toggleSideBar}
            />
            <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
              <Navbar toggleSideBar={toggleSideBar} />
              <Aviatorhistory />
            </div>
          </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/banner",
      element: (
        <PrivateRoute>
          <div className="flex h-screen">
            <Sidebar
              sidebar={sideBar}
              className="flex-1"
              toggleSideBar={toggleSideBar}
            />
            <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
              <Navbar toggleSideBar={toggleSideBar} />
              <Banner />
            </div>
          </div>
        </PrivateRoute>
      ),
    },
    {
      path: "/addbanner",
      element: (
        <PrivateRoute>
          <div className="flex h-screen">
            <Sidebar
              sidebar={sideBar}
              className="flex-1"
              toggleSideBar={toggleSideBar}
            />
            <div className="flex flex-col flex-grow overflow-y-auto flex-[3]">
              <Navbar toggleSideBar={toggleSideBar} />
              <AddBanner />
            </div>
          </div>
        </PrivateRoute>
      ),
    },

    {
      path: "*",
      element: <Error />,
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
export default App;
