# Search Report: Files with S. Bertrand Copyright Notice

## Search Criteria

Searched for files containing the following copyright notice and assumptions:

```
(c) author: S. Bertrand

ASSUMPTION on coordinate system for the map :

        y
        ^(0, dimY-1)  (dimX-1, dimY-1)     
        |
        |(0,0)           (dimX-1,0)
        ------------------------>  x

ASSUMPTION on node  numerotation :

        y
        ^....    ....      ...dimX*dimY-1    
        |dimX  dimX+1 .... ....
        |0   1   2   ...   dimX-1
        ------------------------>  x
```

## Search Methods Used

1. **Author Search**: Searched for "(c) author: S. Bertrand" across all files
2. **Coordinate System Search**: Searched for "ASSUMPTION on coordinate system"
3. **Dimension Variable Search**: Searched for "dimX" and "dimY" variables
4. **Node Numeration Search**: Searched for "node" and "numeration" keywords
5. **Comprehensive File Search**: Examined all source files (.js, .vue, .py, .java, .cpp, .c, .h)

## Search Commands Executed

```bash
grep -r "author: S. Bertrand" /home/runner/work/Cinema-Booking-App/Cinema-Booking-App
grep -r "ASSUMPTION on coordinate system" /home/runner/work/Cinema-Booking-App/Cinema-Booking-App
grep -r "dimX\|dimY" /home/runner/work/Cinema-Booking-App/Cinema-Booking-App
find /home/runner/work/Cinema-Booking-App/Cinema-Booking-App -type f -exec grep -l "S. Bertrand" {} \;
find /home/runner/work/Cinema-Booking-App/Cinema-Booking-App -type f -exec grep -l "coordinate system for the map" {} \;
```

## Results

**No files found** containing the specified copyright notice or assumptions.

### Git Repository Analysis

- **Total Contributors**: 2 (Adri-dou, copilot-swe-agent[bot])
- **Commits searched**: All commits in all branches
- **No commits by author "Bertrand"**: Confirmed
- **No commit messages mentioning "Bertrand"**: Confirmed (except this search report)

## Repository Files Examined

Total source files examined: **32 files**

- JavaScript files (.js): 11 files
- Vue.js files (.vue): 21 files
- TypeScript files (.ts, .tsx, .jsx): 0 files
- Python files (.py): 0 files
- Java files (.java): 0 files  
- C/C++ files (.cpp, .c, .h): 0 files

### Additional Searches Performed

1. **Git History Search**: Searched all git commits for mentions of "Bertrand"
2. **Git Contributors**: Checked all git authors/contributors
3. **Documentation Files**: Searched all .md, .txt, .json files
4. **Line-by-line Inspection**: Examined first 20 lines of all 32 source files

## Conclusion

The Cinema-Booking-App repository does not contain any files with copyright attribution to S. Bertrand or the coordinate system/node numeration assumptions described in the search criteria.

This appears to be a web application for cinema booking built with:
- Frontend: Vue.js
- Backend: Node.js/Express
- Database: MongoDB

The codebase does include seat selection functionality (in `SeatSelection.vue`) which uses a 2D coordinate system for cinema seats, but it does not include the specific copyright notice or assumptions being searched for.

## Date of Search

**October 15, 2025**

## Search Performed By

Automated search across entire repository
