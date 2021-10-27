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
package at.univie.compass.domain;

import java.io.Serializable;
import java.time.ZonedDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * A SharedCourseQrCode.
 */
@Entity
@Table(name = "shared_course_qr_code")
//@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class SharedCourseQrCode extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator", allocationSize = 1)
    private Long id;

    @Column(name = "device")
    private String device;

    @Column(name = "qr_code")
    private String qrCode;

    @Column(name = "scanned")
    private Boolean scanned;

    @Column(name = "time_stamp_scanned")
    private ZonedDateTime timeStampScanned;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnore
    @JsonIgnoreProperties(value = "sharedCourseQrCodes", allowSetters = true)
    private SharedCourse sharedCourse;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDevice() {
        return device;
    }

    public SharedCourseQrCode device(String device) {
        this.device = device;
        return this;
    }

    public void setDevice(String device) {
        this.device = device;
    }

    public String getQrCode() {
        return qrCode;
    }

    public SharedCourseQrCode qrCode(String qrCode) {
        this.qrCode = qrCode;
        return this;
    }

    public void setQrCode(String qrCode) {
        this.qrCode = qrCode;
    }

    public Boolean isScanned() {
        return scanned;
    }

    public SharedCourseQrCode scanned(Boolean scanned) {
        this.scanned = scanned;
        return this;
    }

    public void setScanned(Boolean scanned) {
        this.scanned = scanned;
    }

    public ZonedDateTime getTimeStampScanned() {
        return timeStampScanned;
    }

    public SharedCourseQrCode timeStampScanned(ZonedDateTime timeStampScanned) {
        this.timeStampScanned = timeStampScanned;
        return this;
    }

    public void setTimeStampScanned(ZonedDateTime timeStampScanned) {
        this.timeStampScanned = timeStampScanned;
    }

    public SharedCourse getSharedCourse() {
        return sharedCourse;
    }

    public SharedCourseQrCode sharedCourse(SharedCourse sharedCourse) {
        this.sharedCourse = sharedCourse;
        return this;
    }

    public void setSharedCourse(SharedCourse sharedCourse) {
        this.sharedCourse = sharedCourse;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SharedCourseQrCode)) {
            return false;
        }
        return id != null && id.equals(((SharedCourseQrCode) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SharedCourseQrCode{" +
            "id=" + getId() +
            ", device='" + getDevice() + "'" +
            ", qrCode='" + getQrCode() + "'" +
            ", scanned='" + isScanned() + "'" +
            ", timeStampScanned='" + getTimeStampScanned() + "'" +
            "}";
    }
}
