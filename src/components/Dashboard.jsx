import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL, DEFAULT_USER_IMG } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addConnections, showConnection } from "../utils/connectionSlice";
import ConnectionReqCard from "./ConnectionReqCard";
import { addUserRequest } from "../utils/requestSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Dashboard = ({ user }) => {
  const { connections, isConnection } = useSelector(
    (store) => store.connections
  );
  const requests = useSelector((store) => store.requests);

  const dispatch = useDispatch();

  const getUserConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res?.data?.data || []));
    } catch (error) {
      console.error("Error fetching connections:", error);
      toast("Failed to load connections", { type: "error" });
      dispatch(addConnections([])); // Set empty array on error
    }
  };

  const getUserRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests", {
        withCredentials: true,
      });
      dispatch(addUserRequest(res?.data?.data || []));
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast("Failed to load requests", { type: "error" });
      dispatch(addUserRequest([])); // Set empty array on error
    }
  };

  useEffect(() => {
    getUserConnections();
    getUserRequests();
  }, []);

  // Filter out any potential null users (safety check)
  const validConnections =
    connections?.filter((connection) => connection && connection._id) || [];

  const validRequests =
    requests?.filter(
      (request) => request && request._id && request.fromUserId
    ) || [];

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header Section - Fixed height */}
      <div className="flex-shrink-0">
        <div className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4 bg-emerald-700 border-b-1 border-white/10">
          <Link to={`/user/profile/${user?._id}`}>
            <img
              className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-full border-2"
              src={user?.photos?.[0] || DEFAULT_USER_IMG}
              alt="User Img"
              loading="lazy"
            />
          </Link>
          <p className="font-semibold text-sm sm:text-[18px]">
            {user?.firstName} {user?.lastName}
          </p>
        </div>

        {/* Tabs Section */}
        <div className="flex justify-around py-2 bg-gray-800">
          <div>
            <p
              onClick={() => {
                dispatch(showConnection(true));
                getUserConnections();
              }}
              className="font-semibold hover:text-emerald-700 cursor-pointer text-sm sm:text-base"
            >
              Connections
            </p>
            {isConnection && (
              <p className="h-[4px] w-full px-2 rounded-2xl bg-emerald-700"></p>
            )}
          </div>
          <div>
            <p
              onClick={() => {
                dispatch(showConnection(false));
                getUserRequests();
              }}
              className="font-semibold hover:text-emerald-700 cursor-pointer text-sm sm:text-base"
            >
              Requests
            </p>
            {!isConnection && (
              <p className="h-[4px] w-full px-2 rounded-2xl bg-emerald-700"></p>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable Content Section - Takes remaining space */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {isConnection ? (
          <div className="h-full p-1 sm:p-2">
            {validConnections.length > 0 ? (
              <div className="h-full overflow-y-auto hide-scrollbar">
                <div className="rounded-[10px]">
                  {validConnections.map((connection) => (
                    <ConnectionReqCard
                      key={connection?._id}
                      user={connection}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-4 text-center text-gray-400 text-sm">
                No connections found
              </div>
            )}
          </div>
        ) : (
          <div className="h-full p-1 sm:p-2">
            {validRequests.length > 0 ? (
              <div className="h-full overflow-y-auto hide-scrollbar">
                <div className="rounded-[10px]">
                  {validRequests.map((request) => (
                    <ConnectionReqCard
                      key={request?._id}
                      user={request?.fromUserId}
                      id={request?._id}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-4 text-center text-gray-400 text-sm">
                No requests found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
