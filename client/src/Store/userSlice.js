import { AxiosInstance } from "../Utils/AxiosInstance.js";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
const initialState = {
    userData : {},
    loading : false,
    error : null,
    status: false
}

 const RegisterUser = createAsyncThunk(
    "user/registerUser",
    async (data) => {
        try {
            const response = await AxiosInstance.post("/v1/users/register", data);
            console.log(response.data)
            return response.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    }
);

const UserLogin = createAsyncThunk("user_login", async (data, { rejectWithValue }) => {
    try {
        const LoginResponse = await AxiosInstance.post("/v1/users/login", data)

        return LoginResponse.data.data

    } catch (error) {

        return rejectWithValue(error.response.data)
    }
})


const GetCurrentUser = createAsyncThunk("get_user", async (data, { rejectWithValue }) => {
    try {
        const UserResponse = await AxiosInstance.get("/v1/users/current-user")
        return UserResponse.data
    } catch (error) {
        return rejectWithValue(error.response.data)

    }
})

const UserLogOut = createAsyncThunk("user_logout", async (data, { rejectWithValue }) => {
    try {
        const LogOutResponse = await AxiosInstance.post("/v1/users/logout")
        toast.success("User Logged Out Successfully", {
            autoClose: 3000,
            position: "bottom-right"
        })
        return LogOutResponse.data
    } catch (error) {
        return rejectWithValue(error.response.data)

    }
})

const userSlice = createSlice({
    initialState,
    name: "user",
    reducers: {
   },
   extraReducers:(reducer)=> {
    reducer.addCase(RegisterUser.pending, (state, action) => {
        state.loading = true;
        
    });
    reducer.addCase(RegisterUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;

    });
    reducer.addCase(RegisterUser.rejected, (state, action) => {
        state.loading = true;
        state.error = action.payload.error;

    });
    reducer.addCase(GetCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        state.status = true;
    })
    reducer.addCase(GetCurrentUser.pending, (state, action) => {
        state.loading = true;
        state.status = false;
    })
    reducer.addCase(GetCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.userData = null;
        state.status = false;
        
    })
    reducer.addCase(UserLogin.pending, (state) => {
        state.loading = true;
    })
    reducer.addCase(UserLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "An error occured"
    })
    reducer.addCase(UserLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        state.status = !state.Status;
        state.error = null;
    })
    reducer.addCase(UserLogOut.pending, (state) => {
        state.loading = true;
    })
    reducer.addCase(UserLogOut.fulfilled, (state) => {
        state.loading = false;
        state.status = false;
        state.userData = null;
        state.error = null;
    })
    reducer.addCase(UserLogOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "An error occured"
    })
   }

})


export { RegisterUser, GetCurrentUser ,UserLogin,UserLogOut}


export default userSlice.reducer