import axios from "axios";
import { useEffect, useState } from "react";
import { getUsername } from '../helper/helper'

// axios.defaults.baseURL = process.env.API_BASE_URL;
import { API_BASE_URL } from "../config";
/** custom hook */
export default function useFetch(query){

    const [getData, setData] = useState({ isLoading : false, apiData: undefined, status: null, serverError: null })

    useEffect(() => {

        const fetchData = async () => {
            try {
               
                setData(prev => ({ ...prev, isLoading: true}));

                const { username } = !query ? await getUsername() : '';
                console.log("QQQQ",username,query);
                
                const { data, status } = !query ? await axios.get(`${API_BASE_URL}/api/user/${username}`) : await axios.get(`${API_BASE_URL}/api/${query}`);
                console.log("hello",data);
                if(status === 201){
                    setData(prev => ({ ...prev, isLoading: false}));
                    setData(prev => ({ ...prev, apiData : data, status: status }));
                }
                                                                                                        
                setData(prev => ({ ...prev, isLoading: false}));
            } catch (error) {
                console.log(error);
                setData(prev => ({ ...prev, isLoading: false, serverError: error }))
            }
        };
        fetchData()

    }, [query]);

    return [getData, setData];
}