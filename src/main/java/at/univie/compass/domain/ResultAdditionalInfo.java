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

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * A ResultAdditionalInfo.
 */
@Entity
@Table(name = "result_additional_info")
//@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ResultAdditionalInfo extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator", allocationSize = 1)
    private Long id;

    @Lob
    @Column(name = "gpx_track")
    private byte[] gpxTrack;

    @Column(name = "gpx_track_content_type")
    private String gpxTrackContentType;

    @Lob
    @Column(name = "heart_rate")
    private byte[] heartRate;

    @Column(name = "heart_rate_content_type")
    private String heartRateContentType;

    @OneToOne(mappedBy = "resultAdditionalinfo")
    @JsonIgnore
    private ResultCourse resultCourse;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte[] getGpxTrack() {
        return gpxTrack;
    }

    public ResultAdditionalInfo gpxTrack(byte[] gpxTrack) {
        this.gpxTrack = gpxTrack;
        return this;
    }

    public void setGpxTrack(byte[] gpxTrack) {
        this.gpxTrack = gpxTrack;
    }

    public String getGpxTrackContentType() {
        return gpxTrackContentType;
    }

    public ResultAdditionalInfo gpxTrackContentType(String gpxTrackContentType) {
        this.gpxTrackContentType = gpxTrackContentType;
        return this;
    }

    public void setGpxTrackContentType(String gpxTrackContentType) {
        this.gpxTrackContentType = gpxTrackContentType;
    }

    public byte[] getHeartRate() {
        return heartRate;
    }

    public ResultAdditionalInfo heartRate(byte[] heartRate) {
        this.heartRate = heartRate;
        return this;
    }

    public void setHeartRate(byte[] heartRate) {
        this.heartRate = heartRate;
    }

    public String getHeartRateContentType() {
        return heartRateContentType;
    }

    public ResultAdditionalInfo heartRateContentType(String heartRateContentType) {
        this.heartRateContentType = heartRateContentType;
        return this;
    }

    public void setHeartRateContentType(String heartRateContentType) {
        this.heartRateContentType = heartRateContentType;
    }

    public ResultCourse getResultCourse() {
        return resultCourse;
    }

    public ResultAdditionalInfo resultCourse(ResultCourse resultCourse) {
        this.resultCourse = resultCourse;
        return this;
    }

    public void setResultCourse(ResultCourse resultCourse) {
        this.resultCourse = resultCourse;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ResultAdditionalInfo)) {
            return false;
        }
        return id != null && id.equals(((ResultAdditionalInfo) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ResultAdditionalInfo{" +
            "id=" + getId() +
            ", gpxTrack='" + getGpxTrack() + "'" +
            ", gpxTrackContentType='" + getGpxTrackContentType() + "'" +
            ", heartRate='" + getHeartRate() + "'" +
            ", heartRateContentType='" + getHeartRateContentType() + "'" +
            "}";
    }
}
