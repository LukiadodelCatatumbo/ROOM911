package com.room911.service.interfaces;

import com.room911.dto.LoginRequestDTO;
import com.room911.dto.LoginResponseDTO;

public interface AuthService {

    LoginResponseDTO login(LoginRequestDTO dto);
}
