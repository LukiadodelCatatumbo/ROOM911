package com.room911.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccessQrRequestDTO {

    @NotBlank(message = "El código QR es obligatorio")
    private String codigoQr;
}
