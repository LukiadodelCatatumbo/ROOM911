package com.room911.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccesosSemanaDTO {

    private String dia;

    private Long cantidad;

}