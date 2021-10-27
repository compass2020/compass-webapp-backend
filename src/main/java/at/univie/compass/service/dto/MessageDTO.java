/*-
 * #%L
 * COMPASS orienteering game
 * %%
 * Copyright (C) 2021 University of Vienna
 * %%
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.html>.
 * #L%
 */
package at.univie.compass.service.dto;

import java.util.UUID;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * A DTO representing a message for a player or a broadcast message
 */
public class MessageDTO {

    private UUID uuid;

    @NotNull
    private Long sharedCourseId;

    @NotBlank
    @Size(min = 1, max = 100)
    private String message;

    public MessageDTO() {
    }

    public MessageDTO(UUID uuid, @NotNull Long sharedCourseId, @NotBlank @Size(min = 1, max = 100) String message) {
        super();
        this.uuid = uuid;
        this.sharedCourseId = sharedCourseId;
        this.message = message;
    }

    public UUID getUuid() {
        return uuid;
    }

    public void setUuid(UUID uuid) {
        this.uuid = uuid;
    }

    public Long getSharedCourseId() {
        return sharedCourseId;
    }

    public void setSharedCourseId(Long sharedCourseId) {
        this.sharedCourseId = sharedCourseId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((message == null) ? 0 : message.hashCode());
        result = prime * result + ((sharedCourseId == null) ? 0 : sharedCourseId.hashCode());
        result = prime * result + ((uuid == null) ? 0 : uuid.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        MessageDTO other = (MessageDTO) obj;
        if (message == null) {
            if (other.message != null)
                return false;
        } else if (!message.equals(other.message))
            return false;
        if (sharedCourseId == null) {
            if (other.sharedCourseId != null)
                return false;
        } else if (!sharedCourseId.equals(other.sharedCourseId))
            return false;
        if (uuid == null) {
            if (other.uuid != null)
                return false;
        } else if (!uuid.equals(other.uuid))
            return false;
        return true;
    }

    @Override
    public String toString() {
        return "MessageDTO [uuid=" + uuid + ", sharedCourseId=" + sharedCourseId + ", message=" + message + "]";
    }
}
