import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL, DEFAULT_USER_IMG } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addConnections, showConnection } from "../utils/connectionSlice";
import ConnectionReqCard from "./ConnectionReqCard";
import { addUserRequest } from "../utils/requestSlice";

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
    dispatch(showConnection(false));
  };
  useEffect(() => {
    getUserConnections();
  }, []);
  return (
    <div className="w-4/12 border-r-1 border-white/10">
      <div className="p-4 flex items-center gap-4 bg-emerald-700 border-b-1 border-white/10">
        <img
          className="w-10 h-10 object-cover rounded-full border-2"
          src={user?.photos[0] || DEFAULT_USER_IMG}
          alt="User Img"
        />
        <p className="font-semibold text-[18px]">
          {user?.firstName} {user?.lastName}
        </p>
      </div>
      <div className="flex justify-around py-2">
        <div>
          {" "}
          <p
            onClick={() => dispatch(showConnection(true))}
            className="font-semibold hover:text-emerald-700 cursor-pointer"
          >
            Connections
          </p>
          {isConnection && (
            <p className="h-[4px] w-full px-2 rounded-2xl bg-emerald-700"></p>
          )}
        </div>
        <div>
          <p
            onClick={getUserRequests}
            className="font-semibold hover:text-emerald-700 cursor-pointer"
          >
            Requests
          </p>
          {!isConnection && (
            <p className="h-[4px] w-full px-2 rounded-2xl bg-emerald-700"></p>
          )}
        </div>
      </div>
      {isConnection ? (
        <div className="p-2">
          {connections && connections.length > 0 ? (
            <div className="rounded-[10px]">
              {connections.map((connection) => (
                <ConnectionReqCard key={connection?._id} user={connection} />
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-400">
              No connections found
            </div>
          )}
        </div>
      ) : (
        <div className="p-2">
          {requests && requests.length > 0 ? (
            <div className="rounded-[10px]">
              {requests.map((request) => (
                <ConnectionReqCard
                  key={request?._id}
                  user={request?.fromUserId}
                />
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-400">
              No requests found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
