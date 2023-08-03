/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
import { useContext, useEffect } from "react";
import { ethers } from "ethers";
import {
  setCollections,
  setSingleNfts,
  setPolygonCollections,
  setPolygonSingleNfts,
  setNotification,
  setSearchContainer,
  setAvaxSingleNfts,
} from "../../gen-state/gen.actions";
import {
  getGraphCollections,
  getNftCollections,
  getSingleNfts,
  getSingleGraphNfts,
} from "../../utils";
import {
  GET_GRAPH_COLLECTIONS,
  GET_ALL_POLYGON_COLLECTIONS,
  GET_POLYGON_SINGLE_NFTS,
  GET_POLYGON_SOUL_BOUND_NFTS,
  GET_AVAX_SINGLE_NFTS,
} from "../../graphql/querries/getCollections";
import {
  avalancheClient,
  polygonClient,
} from "../../utils/graphqlClient";
import { GenContext } from "../../gen-state/gen.context";
import {
  parseAvaxSingle,
  parsePolygonCollection,
  parsePolygonSingle,
} from "./fetchData-script";

const FetchData = () => {
  const { dispatch, mainnet } = useContext(GenContext);
  useEffect(() => {
    // Get Polygon Collections
    (async function getPolygonCollections() {
      dispatch(setPolygonCollections(null));

      const { data, error } = await polygonClient.query(GET_ALL_POLYGON_COLLECTIONS).toPromise();
      if (error) {
        return dispatch(
          setNotification({
            message: error.message,
            type: "warning",
          })
        );
      }
      const result = await getGraphCollections(data?.collections);
      const filterAddress =
        process.env.REACT_APP_ENV_STAGING === "true"
          ? ethers.utils.hexlify(process.env.REACT_APP_POLY_TESTNET_SINGLE_ADDRESS)
          : ethers.utils.hexlify(process.env.REACT_APP_GENA_MAINNET_SINGLE_ADDRESS);
      const res = result?.filter((data) => data?.Id !== filterAddress);
      if (res?.length) {
        // dispatch(setPolygonCollections(res));
        dispatch(
          setSearchContainer({
            "Polygon collection": parsePolygonCollection(res),
          })
        );
      } else {
        dispatch(setPolygonCollections(null));
      }
      return null;
    })();

    // Get Polygon Signle NFTs
    (async function getPolygonSingleNfts() {
      dispatch(setPolygonSingleNfts(null));

      const { data, error } = await polygonClient.query(GET_POLYGON_SINGLE_NFTS).toPromise();
      const { data: sbData, error: sbError } = await polygonClient.query(GET_POLYGON_SOUL_BOUND_NFTS).toPromise();
      if (error || sbError) {
        return dispatch(
          setNotification({
            message: error.message,
            type: "warning",
          })
        );
      }
      const result = await getSingleGraphNfts([...data.nfts, ...sbData.nfts]);
      if (result?.length) {
        // dispatch(setPolygonSingleNfts(result));
        dispatch(
          setSearchContainer({
            "Polygon 1of1": parsePolygonSingle(result),
          })
        );
      } else {
        dispatch(setPolygonSingleNfts(null));
      }
      return null;
    })();

    // Avalanche Single Nfts
    (async function getAvalancheSingleNfts() {
      dispatch(setAvaxSingleNfts(null));

      const { data, error } = await avalancheClient.query(GET_AVAX_SINGLE_NFTS).toPromise();
      if (error) {
        return dispatch(
          setNotification({
            message: error.message,
            type: "warning",
          })
        );
      }
      const result = await getSingleGraphNfts(data?.nfts);
      if (result) {
        // dispatch(setAvaxSingleNfts(result));
        dispatch(
          setSearchContainer({
            "Avax 1of1": parseAvaxSingle(result),
          })
        );
      } else {
        dispatch(setAvaxSingleNfts(null));
      }
    })();
  }, [mainnet]);

  return null;
};

export default FetchData;
