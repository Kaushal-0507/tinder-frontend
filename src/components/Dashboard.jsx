import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL, DEFAULT_USER_IMG } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addConnections, showConnection } from "../utils/connectionSlice";
import ConnectionReqCard from "./ConnectionReqCard";
import { addUserRequest } from "../utils/requestSlice";
import { Link } from "react-router-dom";

const Dashboard = ({ user }) => {
  const { connections, isConnection } = useSelector(
    (store) => store.connections
  );
  const requests = useSelector((store) => store.requests);

  const dispatch = useDispatch();
  const getUserConnections = async () => {
    const res = await axios.get(BASE_URL + "/user/connections", {
      withCredentials: true,
    });
    dispatch(addConnections(res?.data?.data));
  };

  const getUserRequests = async () => {
    const res = await axios.get(BASE_URL + "/user/requests", {
      withCredentials: true,
    });
    dispatch(addUserRequest(res?.data?.data));
  };
  useEffect(() => {
    getUserConnections();
    getUserRequests();
  }, []);
  return (
    <div className="w-full h-full">
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
      <div className="flex justify-around py-2">
        <div>
          {" "}
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
      {isConnection ? (
        <div className="p-1 sm:p-2">
          {connections && connections.length > 0 ? (
            <div className="rounded-[10px]">
              {connections.map((connection) => (
                <ConnectionReqCard key={connection?._id} user={connection} />
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-400 text-sm">
              No connections found
            </div>
          )}
        </div>
      ) : (
        <div className="p-1 sm:p-2">
          {requests && requests.length > 0 ? (
            <div className="rounded-[10px]">
              {requests.map((request) => (
                <ConnectionReqCard
                  key={request?._id}
                  user={request?.fromUserId}
                  id={request?._id}
                />
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-400 text-sm">
              No requests found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
