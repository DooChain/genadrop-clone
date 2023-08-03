/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import { gql } from "@apollo/client";
import { ethers } from "ethers";
import {
  GET_ALL_POLYGON_COLLECTIONS,
  GET_AVAX_SINGLE_NFTS,
  GET_AVAX_SINGLE_NFTS_WITH_LIMIT,
  GET_AVAX_SOUL_BOUND_NFTS,
  GET_AVAX_SOUL_BOUND_NFTS_WITH_LIMITS,
  GET_ALL_AVALANCHE_COLLECTIONS,
  GET_FEATURED_SINGLE_NFT,
  GET_GRAPH_COLLECTIONS,
  GET_GRAPH_NFT,
  GET_POLYGON_SINGLE_NFTS,
  GET_POLYGON_SINGLE_NFTS_WITH_LIMIT,
  GET_POLYGON_SOUL_BOUND_NFTS,
  GET_POLYGON_SOUL_BOUND_NFTS_WITH_LIMITS,
  GET_SINGLE_GRAPH_COLLECTION,
  GET_USER_COLLECTIONS,
  GET_USER_NFT,
} from "../../graphql/querries/getCollections";
import {
  getGraphCollection,
  getGraphCollections,
  getGraphNft,
  getGraphTransactionHistory,
  getSingleGraphNfts,
  getTransactions,
  getUserGraphNft,
  getNftCollections,
  getSingleNfts,
  getGraphCollectionData,
  getFeaturedGraphNft,
} from "../../utils";
import { avalancheClient, polygonClient, nearClient } from "../../utils/graphqlClient";

const soulboundSingleFilterAddress = ethers.utils.hexlify(process.env.REACT_APP_POLY_MAINNET_SOULBOUND_ADDRESS);

export const polygonUserData = async (address) => {
  const { data: polygonData, error: polygonError } = await polygonClient
    .query(GET_GRAPH_NFT, { id: address })
    .toPromise();
  if (polygonError) return;
  let trHistory;
  let polygonResult = [];
  if (polygonData?.nft !== null) {
    polygonResult = await getGraphNft(polygonData?.nft);
    trHistory = await getTransactions(polygonData?.nft?.transactions);
    trHistory.find((t) => {
      if (t.type === "Minting") t.price = polygonResult[0].price;
    });
  }
  return [polygonResult[0], trHistory];
};

export const getAvalancheNft = async (address) => {
  const { data: avaxData, error: avaxError } = await avalancheClient.query(GET_GRAPH_NFT, { id: address }).toPromise();
  if (avaxError) return;
  let trHistory;
  let avaxResult = [];
  if (avaxData?.nft !== null) {
    avaxResult = await getGraphNft(avaxData?.nft);
    trHistory = await getTransactions(avaxData?.nft?.transactions);
    trHistory.find((t) => {
      if (t.type === "Minting") t.price = avaxResult[0].price;
    });
  }
  return [avaxResult[0], trHistory];
};

export const getFeaturedAvalancheNft = async (address) => {
  const { data, error } = await avalancheClient.query(GET_GRAPH_NFT, { id: address }).toPromise();
  if (error) return [];
  const result = await getFeaturedGraphNft(data?.nft);
  return result;
};

export const getFeaturedPolygonNfts = async (address) => {
  const { data: polygonData, error: polygonError } = await polygonClient
    .query(GET_GRAPH_NFT, { id: address })
    .toPromise();
  if (polygonError) return [];
  const result = await getFeaturedGraphNft(polygonData?.nft);
  return result;
};
export const nearFeaturedNfts = async (address) => {
  const { data, error } = await nearClient.query(GET_FEATURED_SINGLE_NFT, { id: address }).toPromise();
  if (error) return [];
  const nearData = await getGraphNft(data?.nft);
  return nearData;
};

export const getPolygonNFTToList = async (address, nftId) => {
  const { data, error: polygonError } = await polygonClient.query(GET_USER_NFT, { id: address }).toPromise();
  if (polygonError) return;
  const polygonBoughtNft = await getUserGraphNft(data?.user?.nfts, address);
  const nft = polygonBoughtNft.filter((NFT) => NFT.tokenID === nftId)[0];
  return nft;
};

export const getPolygonCollectedNFTs = async (address) => {
  const { data, error: polygonError } = await polygonClient.query(GET_USER_NFT, { id: address }).toPromise();
  if (polygonError) return;
  const response = await getSingleGraphNfts(data?.user?.nfts, address);
  const polygonBoughtNft = response?.filter((NFTS) => NFTS.sold === true);
  return polygonBoughtNft;
};

export const getPolygonMintedNFTs = async (address) => {
  const { data, error: polygonError } = await polygonClient.query(GET_USER_NFT, { id: address }).toPromise();
  if (polygonError) return;

  const filterAddress =
    process.env.REACT_APP_ENV_STAGING === "true"
      ? ethers.utils.hexlify(process.env.REACT_APP_POLY_TESTNET_SINGLE_ADDRESS)
      : ethers.utils.hexlify(process.env.REACT_APP_GENA_MAINNET_SINGLE_ADDRESS);
  const response = await getSingleGraphNfts(data?.user?.nfts, data?.user?.id);
  const polygonMintedNfts = response?.filter(
    (NFTS) =>
      !NFTS?.sold && (NFTS?.collectionId === soulboundSingleFilterAddress || NFTS?.collectionId === filterAddress)
  );
  return polygonMintedNfts;
};

export const getAvaxMintedNfts = async (address) => {
  const { data, error: avaxError } = await avalancheClient.query(GET_USER_NFT, { id: address }).toPromise();
  if (avaxError) return;

  const filterAddress =
    process.env.REACT_APP_ENV_STAGING === "true"
      ? ethers.utils.hexlify(process.env.REACT_APP_AVAX_TESTNET_SINGLE_ADDRESS)
      : ethers.utils.hexlify(process.env.REACT_APP_AVAX_MAINNET_SINGLE_ADDRESS);
  const response = await getSingleGraphNfts(data?.user?.nfts, data?.user?.id);
  const avaxMintedNfts = response?.filter(
    (NFTS) =>
      !NFTS?.sold && (NFTS?.collectionId === soulboundSingleFilterAddress || NFTS?.collectionId === filterAddress)
  );
  return avaxMintedNfts;
};

export const getPolygonSingleCollection = async (address) => {
  const { data, error } = await polygonClient.query(GET_SINGLE_GRAPH_COLLECTION, { id: address }).toPromise();
  if (error) return;
  const nftData = await getGraphCollection(data?.collection?.nfts, data?.collection);
  const collectionData = await getGraphCollectionData(data?.collection);
  return [nftData, collectionData];
};

export const getAvalancheSingleCollection = async (address) => {
  const { data, error } = await avalancheClient.query(GET_SINGLE_GRAPH_COLLECTION, { id: address }).toPromise();
  if (error) return;
  const nftData = await getGraphCollection(data?.collection?.nfts, data?.collection);
  const collectionData = await getGraphCollectionData(data?.collection);
  return [nftData, collectionData];
};

export const getAvaxCollectedNFTs = async (address) => {
  const { data, error: auroraError } = await avalancheClient.query(GET_USER_NFT, { id: address }).toPromise();
  if (auroraError) return;
  const response = await getSingleGraphNfts(data?.user?.nfts, address);
  const avaxCollectedNfts = response?.filter((NFTS) => NFTS?.sold === true);
  return avaxCollectedNfts;
};

export const getAvaxUserCollections = async (account) => {
  const { data, error: avaxError } = await avalancheClient.query(GET_USER_COLLECTIONS, { id: account }).toPromise();
  if (avaxError) return;
  const result = await getGraphCollections(data?.user?.collections);
  return result;
};

export const getPolygonUserCollections = async (account) => {
  const { data, error: polygonError } = await polygonClient.query(GET_USER_COLLECTIONS, { id: account }).toPromise();
  if (polygonError) return;
  const result = await getGraphCollections(data?.user?.collections);
  return result;
};

export const getAllPolygonNfts = async (limit) => {
  const { data: graphData, error } = await polygonClient
    .query(limit ? GET_POLYGON_SINGLE_NFTS_WITH_LIMIT : GET_POLYGON_SINGLE_NFTS)
    .toPromise();
  const { data: sbData, error: sbError } = await polygonClient
    .query(limit ? GET_POLYGON_SOUL_BOUND_NFTS_WITH_LIMITS : GET_POLYGON_SOUL_BOUND_NFTS)
    .toPromise();

  if (error || sbError) return [];
  const data = getSingleGraphNfts([...graphData.nfts, ...sbData.nfts]);
  return data;
};
export const getAllNearNfts = async (limit) => {
  const { data: graphData, error } = await nearClient
    .query(limit ? GET_NEAR_SINGLE_NFTS_WITH_LIMIT : GET_NEAR_SINGLE_NFTS)
    .toPromise();
  if (error) return [];
  const data = await getNearSingleGraphNfts(graphData?.nfts);
  return data;
};

export const getAllAvalancheNfts = async (limit) => {
  const { data: graphData, error } = await avalancheClient
    .query(limit ? GET_AVAX_SINGLE_NFTS_WITH_LIMIT : GET_AVAX_SINGLE_NFTS)
    .toPromise();
  const { data: sbData, error: sbError } = await avalancheClient
    .query(limit ? GET_AVAX_SOUL_BOUND_NFTS_WITH_LIMITS : GET_AVAX_SOUL_BOUND_NFTS)
    .toPromise();

  if (error || sbError) return [];
  const data = getSingleGraphNfts([...graphData.nfts, ...sbData.nfts]);
  return data;
};

export const getAllAvalancheCollections = async () => {
  const { data, error } = await avalancheClient.query(GET_ALL_AVALANCHE_COLLECTIONS).toPromise();
  if (error) return [];
  const result = await getGraphCollections(data?.collections);
  const filterAddress =
    process.env.REACT_APP_ENV_STAGING === "true"
      ? ethers.utils.hexlify(process.env.REACT_APP_AVAX_TESTNET_SINGLE_ADDRESS)
      : ethers.utils.hexlify(process.env.REACT_APP_AVAX_MAINNET_SINGLE_ADDRESS);
  const res = result?.filter((aurora) => aurora?.Id !== filterAddress && aurora?.Id !== soulboundSingleFilterAddress);
  return res;
};

export const getAllPolygonCollections = async () => {
  const { data, error } = await polygonClient.query(GET_ALL_POLYGON_COLLECTIONS).toPromise();
  if (error) return [];
  const result = await getGraphCollections(data?.collections);
  const filterAddress =
    process.env.REACT_APP_ENV_STAGING === "true"
      ? ethers.utils.hexlify(process.env.REACT_APP_POLY_TESTNET_SINGLE_ADDRESS)
      : ethers.utils.hexlify(process.env.REACT_APP_GENA_MAINNET_SINGLE_ADDRESS);
  const res = result?.filter((aurora) => aurora?.Id !== filterAddress && aurora?.Id !== soulboundSingleFilterAddress);
  return res;
};

export const polygonCollectionTransactions = async (id) => {
  const { data: celoData, error: celoError } = await polygonClient
    .query(
      gql`query MyQuery {
      transactions(
        where: {nft_contains: "${id}"}
        orderBy: txDate
      ) {
        id
        price
        txDate
        txId
        type
        to {
          id
        }
        from {
          id
        }
      }
    }`
    )
    .toPromise();
  if (celoError) return;
  const transaction = getGraphTransactionHistory(celoData?.transactions);
  if (transaction) return (await transaction).reverse();
};
