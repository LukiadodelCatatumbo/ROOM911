package com.room911.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccessRequestDTO {
    @NotBlank (message = "El documento es obligatorio")
    private String documento;
}
