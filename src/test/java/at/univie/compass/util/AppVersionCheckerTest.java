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
package at.univie.compass.util;

import static org.junit.jupiter.api.Assertions.*;

import java.util.UUID;

import org.apache.commons.lang3.RandomStringUtils;
import org.junit.jupiter.api.Test;

class AppVersionCheckerTest {

    @Test
    void testVersionFormat() {

        assertEquals(5, AppVersionChecker.getVersionNumber("0.1.4(5)"));
        assertEquals(5, AppVersionChecker.getVersionNumber("0.1.4 (5)"));
        assertEquals(50, AppVersionChecker.getVersionNumber("0.1.4 (50)"));
        assertEquals(500, AppVersionChecker.getVersionNumber("0.1.4 (500)"));
    }

    @Test
    void testWrongVersionFormat() {

        assertEquals(0, AppVersionChecker.getVersionNumber(""));
        assertEquals(0, AppVersionChecker.getVersionNumber(null));
        assertEquals(0, AppVersionChecker.getVersionNumber("0.1.4"));
        assertEquals(0, AppVersionChecker.getVersionNumber("0.1.4 (xxx)"));
    }
}
