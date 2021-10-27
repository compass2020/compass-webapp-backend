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
package at.univie.compass.web.rest;

import at.univie.compass.CompassApp;
import at.univie.compass.domain.ResultQuestion;
import at.univie.compass.domain.Category;
import at.univie.compass.domain.ResultControlpoint;
import at.univie.compass.repository.ResultQuestionRepository;
import at.univie.compass.security.AuthoritiesConstants;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import at.univie.compass.domain.enumeration.QuestionType;
import at.univie.compass.domain.enumeration.Difficulty;
/**
 * Integration tests for the {@link ResultQuestionResource} REST controller.
 */
@SpringBootTest(classes = CompassApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class ResultQuestionResourceIT {

    private static final String DEFAULT_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_TEXT = "BBBBBBBBBB";

    private static final QuestionType DEFAULT_TYPE = QuestionType.SINGLE;
    private static final QuestionType UPDATED_TYPE = QuestionType.MULTIPLE;

    private static final Difficulty DEFAULT_DIFFICULTY = Difficulty.EASY;
    private static final Difficulty UPDATED_DIFFICULTY = Difficulty.MEDIUM;

    private static final Boolean DEFAULT_ANSWERED_CORRECTLY = false;
    private static final Boolean UPDATED_ANSWERED_CORRECTLY = true;

    @Autowired
    private ResultQuestionRepository resultQuestionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restResultQuestionMockMvc;

    private ResultQuestion resultQuestion;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ResultQuestion createEntity(EntityManager em) {
        ResultQuestion resultQuestion = new ResultQuestion()
            .text(DEFAULT_TEXT)
            .type(DEFAULT_TYPE)
            .difficulty(DEFAULT_DIFFICULTY)
            .answeredCorrectly(DEFAULT_ANSWERED_CORRECTLY);
        // Add required entity
        Category category;
        if (TestUtil.findAll(em, Category.class).isEmpty()) {
            category = CategoryResourceIT.createEntity(em);
            em.persist(category);
            em.flush();
        } else {
            category = TestUtil.findAll(em, Category.class).get(0);
        }
        resultQuestion.setCategory(category);
        // Add required entity
        // TF: ACHTUNG Generierter Code von JHipster deaktiviert führt zu Stackoverflow !!!
//        ResultControlpoint resultControlpoint;
//        if (TestUtil.findAll(em, ResultControlpoint.class).isEmpty()) {
//            resultControlpoint = ResultControlpointResourceIT.createEntity(em);
//            em.persist(resultControlpoint);
//            em.flush();
//        } else {
//            resultControlpoint = TestUtil.findAll(em, ResultControlpoint.class).get(0);
//        }
//        resultQuestion.getResultControlpoints().add(resultControlpoint);
        return resultQuestion;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ResultQuestion createUpdatedEntity(EntityManager em) {
        ResultQuestion resultQuestion = new ResultQuestion()
            .text(UPDATED_TEXT)
            .type(UPDATED_TYPE)
            .difficulty(UPDATED_DIFFICULTY)
            .answeredCorrectly(UPDATED_ANSWERED_CORRECTLY);
        // Add required entity
        Category category;
        if (TestUtil.findAll(em, Category.class).isEmpty()) {
            category = CategoryResourceIT.createUpdatedEntity(em);
            em.persist(category);
            em.flush();
        } else {
            category = TestUtil.findAll(em, Category.class).get(0);
        }
        resultQuestion.setCategory(category);
        // Add required entity
        ResultControlpoint resultControlpoint;
        if (TestUtil.findAll(em, ResultControlpoint.class).isEmpty()) {
            resultControlpoint = ResultControlpointResourceIT.createUpdatedEntity(em);
            em.persist(resultControlpoint);
            em.flush();
        } else {
            resultControlpoint = TestUtil.findAll(em, ResultControlpoint.class).get(0);
        }
        resultQuestion.getResultControlpoints().add(resultControlpoint);
        return resultQuestion;
    }

    @BeforeEach
    public void initTest() {
        resultQuestion = createEntity(em);
    }

    @Test
    @Transactional
    public void createResultQuestion() throws Exception {
        int databaseSizeBeforeCreate = resultQuestionRepository.findAll().size();
        // Create the ResultQuestion
        restResultQuestionMockMvc.perform(post("/api/result-questions")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(resultQuestion)))
            .andExpect(status().isCreated());

        // Validate the ResultQuestion in the database
        List<ResultQuestion> resultQuestionList = resultQuestionRepository.findAll();
        assertThat(resultQuestionList).hasSize(databaseSizeBeforeCreate + 1);
        ResultQuestion testResultQuestion = resultQuestionList.get(resultQuestionList.size() - 1);
        assertThat(testResultQuestion.getText()).isEqualTo(DEFAULT_TEXT);
        assertThat(testResultQuestion.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testResultQuestion.getDifficulty()).isEqualTo(DEFAULT_DIFFICULTY);
        assertThat(testResultQuestion.isAnsweredCorrectly()).isEqualTo(DEFAULT_ANSWERED_CORRECTLY);
    }

    @Test
    @Transactional
    public void createResultQuestionWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = resultQuestionRepository.findAll().size();

        // Create the ResultQuestion with an existing ID
        resultQuestion.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restResultQuestionMockMvc.perform(post("/api/result-questions")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(resultQuestion)))
            .andExpect(status().isBadRequest());

        // Validate the ResultQuestion in the database
        List<ResultQuestion> resultQuestionList = resultQuestionRepository.findAll();
        assertThat(resultQuestionList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkTextIsRequired() throws Exception {
        int databaseSizeBeforeTest = resultQuestionRepository.findAll().size();
        // set the field null
        resultQuestion.setText(null);

        // Create the ResultQuestion, which fails.


        restResultQuestionMockMvc.perform(post("/api/result-questions")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(resultQuestion)))
            .andExpect(status().isBadRequest());

        List<ResultQuestion> resultQuestionList = resultQuestionRepository.findAll();
        assertThat(resultQuestionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = resultQuestionRepository.findAll().size();
        // set the field null
        resultQuestion.setType(null);

        // Create the ResultQuestion, which fails.


        restResultQuestionMockMvc.perform(post("/api/result-questions")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(resultQuestion)))
            .andExpect(status().isBadRequest());

        List<ResultQuestion> resultQuestionList = resultQuestionRepository.findAll();
        assertThat(resultQuestionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDifficultyIsRequired() throws Exception {
        int databaseSizeBeforeTest = resultQuestionRepository.findAll().size();
        // set the field null
        resultQuestion.setDifficulty(null);

        // Create the ResultQuestion, which fails.


        restResultQuestionMockMvc.perform(post("/api/result-questions")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(resultQuestion)))
            .andExpect(status().isBadRequest());

        List<ResultQuestion> resultQuestionList = resultQuestionRepository.findAll();
        assertThat(resultQuestionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    @WithMockUser(authorities = AuthoritiesConstants.ADMIN)
    public void getAllResultQuestions() throws Exception {
        // Initialize the database
        resultQuestionRepository.saveAndFlush(resultQuestion);

        // Get all the resultQuestionList
        restResultQuestionMockMvc.perform(get("/api/result-questions?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(resultQuestion.getId().intValue())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT)))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].difficulty").value(hasItem(DEFAULT_DIFFICULTY.toString())))
            .andExpect(jsonPath("$.[*].answeredCorrectly").value(hasItem(DEFAULT_ANSWERED_CORRECTLY.booleanValue())));
    }
    
    @Test
    @Transactional
    public void getResultQuestion() throws Exception {
        // Initialize the database
        resultQuestionRepository.saveAndFlush(resultQuestion);

        // Get the resultQuestion
        restResultQuestionMockMvc.perform(get("/api/result-questions/{id}", resultQuestion.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(resultQuestion.getId().intValue()))
            .andExpect(jsonPath("$.text").value(DEFAULT_TEXT))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.difficulty").value(DEFAULT_DIFFICULTY.toString()))
            .andExpect(jsonPath("$.answeredCorrectly").value(DEFAULT_ANSWERED_CORRECTLY.booleanValue()));
    }
    @Test
    @Transactional
    public void getNonExistingResultQuestion() throws Exception {
        // Get the resultQuestion
        restResultQuestionMockMvc.perform(get("/api/result-questions/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateResultQuestion() throws Exception {
        // Initialize the database
        resultQuestionRepository.saveAndFlush(resultQuestion);

        int databaseSizeBeforeUpdate = resultQuestionRepository.findAll().size();

        // Update the resultQuestion
        ResultQuestion updatedResultQuestion = resultQuestionRepository.findById(resultQuestion.getId()).get();
        // Disconnect from session so that the updates on updatedResultQuestion are not directly saved in db
        em.detach(updatedResultQuestion);
        updatedResultQuestion
            .text(UPDATED_TEXT)
            .type(UPDATED_TYPE)
            .difficulty(UPDATED_DIFFICULTY)
            .answeredCorrectly(UPDATED_ANSWERED_CORRECTLY);

        restResultQuestionMockMvc.perform(put("/api/result-questions")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedResultQuestion)))
            .andExpect(status().isOk());

        // Validate the ResultQuestion in the database
        List<ResultQuestion> resultQuestionList = resultQuestionRepository.findAll();
        assertThat(resultQuestionList).hasSize(databaseSizeBeforeUpdate);
        ResultQuestion testResultQuestion = resultQuestionList.get(resultQuestionList.size() - 1);
        assertThat(testResultQuestion.getText()).isEqualTo(UPDATED_TEXT);
        assertThat(testResultQuestion.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testResultQuestion.getDifficulty()).isEqualTo(UPDATED_DIFFICULTY);
        assertThat(testResultQuestion.isAnsweredCorrectly()).isEqualTo(UPDATED_ANSWERED_CORRECTLY);
    }

    @Test
    @Transactional
    public void updateNonExistingResultQuestion() throws Exception {
        int databaseSizeBeforeUpdate = resultQuestionRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restResultQuestionMockMvc.perform(put("/api/result-questions")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(resultQuestion)))
            .andExpect(status().isBadRequest());

        // Validate the ResultQuestion in the database
        List<ResultQuestion> resultQuestionList = resultQuestionRepository.findAll();
        assertThat(resultQuestionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteResultQuestion() throws Exception {
        // Initialize the database
        resultQuestionRepository.saveAndFlush(resultQuestion);

        int databaseSizeBeforeDelete = resultQuestionRepository.findAll().size();

        // Delete the resultQuestion
        restResultQuestionMockMvc.perform(delete("/api/result-questions/{id}", resultQuestion.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ResultQuestion> resultQuestionList = resultQuestionRepository.findAll();
        assertThat(resultQuestionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
