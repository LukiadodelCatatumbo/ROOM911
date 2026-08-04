package com.room911.service.interfaces;

import com.room911.dto.AdminUserDTO;
import com.room911.dto.LoginRequestDTO;
import com.room911.dto.LoginResponseDTO;

import java.util.List;

public interface AdminUserService {

    AdminUserDTO crear(AdminUserDTO dto);

    LoginResponseDTO login(LoginRequestDTO dto);

    List<AdminUserDTO> listar();

}