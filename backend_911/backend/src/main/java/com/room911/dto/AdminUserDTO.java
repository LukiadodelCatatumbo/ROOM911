package com.room911.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUserDTO {
    private Long id;
    private String username;
    private String password;
    private String nombre;
}