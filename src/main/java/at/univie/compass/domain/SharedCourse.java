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
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import at.univie.compass.domain.enumeration.GameModus;

/**
 * A SharedCourse.
 */
@Entity
@Table(name = "shared_course")
//@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class SharedCourse extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator", allocationSize = 1)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "qr_code")
    private String qrCode;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "game_modus", nullable = false)
    private GameModus gameModus;

    //@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss.SSS", timezone="UTC")
    @Column(name = "time_stamp_shared")
    private ZonedDateTime timeStampShared;

    @Column(name = "visible")
    private Boolean visible;

    @Column(name = "time_stamp_start")
    private ZonedDateTime timeStampStart;

    @Column(name = "time_stamp_end")
    private ZonedDateTime timeStampEnd;

    @Column(name = "number_of_custom_qr_codes")
    private Integer numberOfCustomQrCodes;

    @Column(name = "show_course_before_start")
    private Boolean showCourseBeforeStart;

    @Column(name = "show_position_allowed")
    private Boolean showPositionAllowed;

    @OneToMany(mappedBy = "sharedCourse", cascade = CascadeType.ALL)
    //@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<ResultCourse> resultCourses = new HashSet<>();

    @OneToMany(mappedBy = "sharedCourse", cascade = CascadeType.ALL)
    //@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<SharedCourseQrCode> sharedCourseQrCodes = new HashSet<>();

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = "sharedCourses", allowSetters = true)
    private Course course;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public SharedCourse name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getQrCode() {
        return qrCode;
    }

    public SharedCourse qrCode(String qrCode) {
        this.qrCode = qrCode;
        return this;
    }

    public void setQrCode(String qrCode) {
        this.qrCode = qrCode;
    }

    public GameModus getGameModus() {
        return gameModus;
    }

    public SharedCourse gameModus(GameModus gameModus) {
        this.gameModus = gameModus;
        return this;
    }

    public void setGameModus(GameModus gameModus) {
        this.gameModus = gameModus;
    }

    public ZonedDateTime getTimeStampShared() {
        return timeStampShared;
    }

    public SharedCourse timeStampShared(ZonedDateTime timeStampShared) {
        this.timeStampShared = timeStampShared;
        return this;
    }

    public void setTimeStampShared(ZonedDateTime timeStampShared) {
        this.timeStampShared = timeStampShared;
    }

    public Boolean isVisible() {
        return visible;
    }

    public SharedCourse visible(Boolean visible) {
        this.visible = visible;
        return this;
    }

    public void setVisible(Boolean visible) {
        this.visible = visible;
    }

    public ZonedDateTime getTimeStampStart() {
        return timeStampStart;
    }

    public SharedCourse timeStampStart(ZonedDateTime timeStampStart) {
        this.timeStampStart = timeStampStart;
        return this;
    }

    public void setTimeStampStart(ZonedDateTime timeStampStart) {
        this.timeStampStart = timeStampStart;
    }

    public ZonedDateTime getTimeStampEnd() {
        return timeStampEnd;
    }

    public SharedCourse timeStampEnd(ZonedDateTime timeStampEnd) {
        this.timeStampEnd = timeStampEnd;
        return this;
    }

    public void setTimeStampEnd(ZonedDateTime timeStampEnd) {
        this.timeStampEnd = timeStampEnd;
    }

    public Integer getNumberOfCustomQrCodes() {
        return numberOfCustomQrCodes;
    }

    public SharedCourse numberOfCustomQrCodes(Integer numberOfCustomQrCodes) {
        this.numberOfCustomQrCodes = numberOfCustomQrCodes;
        return this;
    }

    public void setNumberOfCustomQrCodes(Integer numberOfCustomQrCodes) {
        this.numberOfCustomQrCodes = numberOfCustomQrCodes;
    }

    public Boolean isShowCourseBeforeStart() {
        return showCourseBeforeStart;
    }

    public SharedCourse showCourseBeforeStart(Boolean showCourseBeforeStart) {
        this.showCourseBeforeStart = showCourseBeforeStart;
        return this;
    }

    public void setShowCourseBeforeStart(Boolean showCourseBeforeStart) {
        this.showCourseBeforeStart = showCourseBeforeStart;
    }

    public Boolean isShowPositionAllowed() {
        return showPositionAllowed;
    }

    public SharedCourse showPositionAllowed(Boolean showPositionAllowed) {
        this.showPositionAllowed = showPositionAllowed;
        return this;
    }

    public void setShowPositionAllowed(Boolean showPositionAllowed) {
        this.showPositionAllowed = showPositionAllowed;
    }

    public Set<ResultCourse> getResultCourses() {
        return resultCourses;
    }

    public SharedCourse resultCourses(Set<ResultCourse> resultCourses) {
        this.resultCourses = resultCourses;
        return this;
    }

    public SharedCourse addResultCourse(ResultCourse resultCourse) {
        this.resultCourses.add(resultCourse);
        resultCourse.setSharedCourse(this);
        return this;
    }

    public SharedCourse removeResultCourse(ResultCourse resultCourse) {
        this.resultCourses.remove(resultCourse);
        resultCourse.setSharedCourse(null);
        return this;
    }

    public void setResultCourses(Set<ResultCourse> resultCourses) {
        this.resultCourses = resultCourses;
    }

    public Set<SharedCourseQrCode> getSharedCourseQrCodes() {
        return sharedCourseQrCodes;
    }

    public SharedCourse sharedCourseQrCodes(Set<SharedCourseQrCode> sharedCourseQrCodes) {
        this.sharedCourseQrCodes = sharedCourseQrCodes;
        return this;
    }

    public SharedCourse addSharedCourseQrCode(SharedCourseQrCode sharedCourseQrCode) {
        this.sharedCourseQrCodes.add(sharedCourseQrCode);
        sharedCourseQrCode.setSharedCourse(this);
        return this;
    }

    public SharedCourse removeSharedCourseQrCode(SharedCourseQrCode sharedCourseQrCode) {
        this.sharedCourseQrCodes.remove(sharedCourseQrCode);
        sharedCourseQrCode.setSharedCourse(null);
        return this;
    }

    public void setSharedCourseQrCodes(Set<SharedCourseQrCode> sharedCourseQrCodes) {
        this.sharedCourseQrCodes = sharedCourseQrCodes;
    }

    public Course getCourse() {
        return course;
    }

    public SharedCourse course(Course course) {
        this.course = course;
        return this;
    }

    public void setCourse(Course course) {
        this.course = course;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SharedCourse)) {
            return false;
        }
        return id != null && id.equals(((SharedCourse) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SharedCourse{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", qrCode='" + getQrCode() + "'" +
            ", gameModus='" + getGameModus() + "'" +
            ", timeStampShared='" + getTimeStampShared() + "'" +
            ", visible='" + isVisible() + "'" +
            ", timeStampStart='" + getTimeStampStart() + "'" +
            ", timeStampEnd='" + getTimeStampEnd() + "'" +
            ", numberOfCustomQrCodes=" + getNumberOfCustomQrCodes() +
            ", showCourseBeforeStart='" + isShowCourseBeforeStart() + "'" +
            ", showPositionAllowed='" + isShowPositionAllowed() + "'" +
            "}";
    }
}
