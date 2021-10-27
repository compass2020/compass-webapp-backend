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

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Validates the App version.
 * 
 * @author tfichtenbauer
 *
 */
public class AppVersionChecker {
    
    private static final String VERSION_PATTERN = ".*\\((\\d+)\\)";

    /**
     * Version must be in the Format 0.1.4 (5). 
     * 
     * @param appVersion the complete version string.
     * @return the version number in round brackets.
     */
    public static int getVersionNumber(String appVersion) {
        
        int version = 0;
        Pattern r = Pattern.compile(VERSION_PATTERN);
        
        if (appVersion != null) {
            Matcher m = r.matcher(appVersion);

            if (m.find()) {
                version = Integer.valueOf(m.group(1));
            }
        }
     
        return version;
    }
}
