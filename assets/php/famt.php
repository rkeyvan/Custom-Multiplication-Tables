<?php
	// ========================================================================
	// file: famt.php
	// ========================================================================
	//
	// Description:
	//      This script obtains the URL parameters and creates the desired
	//		multiplication table. It first sanitizes the values and then starts
	//		echoing the results back to the Javascript.
	//
	// ========================================================================

	// ==== isInt =============================================================
	//
	// Checks if the parameter variable can be a integer type.
	// If it can, convert it into an integer before returning a true value.
	//
	// Input:
	//
	//   &$int		-- a reference to the potential integer value
	//
	// Output:
	//
	//   return true if parameter can be a integer type, otherwise false
	//
	// ========================================================================
	function isInt(&$int){
		if (filter_var($int, FILTER_VALIDATE_INT) === false) {
    		return false;
		} else {
			$int = (int) $int;
		    return true;
		}
	} // end of "isInt"

	// ==== isFloat ===========================================================
	//
	// Checks if the parameter variable can be a float type.
	// If it can, convert it into an float before returning a true value.
	//
	// Parameters:
	//
	//   &$float		-- a reference to the potential float value
	//
	// Return:
	//
	//   "true" if parameter can be a float type. Otherwise "false"
	//
	// ========================================================================
	function isFloat(&$float){
		if (filter_var($float, FILTER_VALIDATE_FLOAT) === false) {
    		return false;
		} else {
			$float = (float) $float;
		    return true;
		}
	} // end of "isFloat"

	// ==== chkParam ==========================================================
	//
	// This function checks and converts its parameter variable into a integer
	// or a float. 
	//
	// Parameters:
	//
	//   $urlParam		-- a URL parameter to verify
	//	 $dataName		-- name of the parameter being checked
	//
	// Return:
	//
	//   "integer" or "float" value
	//
	// ========================================================================
	function chkParam($urlParam, $dataName){
		$res = array(
			'valid' => FALSE,
			'data' => "",
			'err' => array()
		);

		if(isInt($urlParam) === true){
			$res['valid'] = TRUE;
			$res['data'] = $urlParam;
			return $res;
		} else if (isFloat($urlParam) === true){
			$res['valid'] = TRUE;
			$res['data'] = $urlParam;
			return $res;
		} else {
			$res['valid'] = FALSE;
			$res['data'] = $dataName . ' input is not a number!.<br>';
			$res['err'] .= $dataName;
			return $res;
		}
	} // end of "chkParam"

	// ==== chkStartEndDiff ===================================================
	//
	// Checks if the start and end range is not greater then "MAX_DIFFERENCE".
	//
	// Parameters:
	//
	//   $start			-- the starting number of a column or row
	//	 $end			-- the ending number of a column or row
	//	 $startName		-- the start input name of the parameter being checked
	//	 $endName		-- the end input name of the parameter being checked
	//	 $diffName		-- the start/end name being checked
	//
	// Return:
	//
	//   nothing
	//
	// ========================================================================
	function chkStartEndDiff($start, $end, $startName, $endName, $diffName){
		$res = array(
			'valid' => FALSE,
			'data' => "",
			'err' => array()
		);

		if($start > $end){
			$diff = ($start - $end) + 1;
		} else {
			$diff = ($end - $start) + 1;
		}

		if(abs($diff) > MAX_DIFFERENCE){
			$res['valid'] = FALSE;
			$res['data'] = 
				'The table you are trying to create is too large!<br>
				The range between ' . $startName . ' and ' . $endName . ' is <span class="text-underline text-bold">' . abs($diff) . '</span>.<br>
				The maximum difference is <span class="text-underline text-bold">' . MAX_DIFFERENCE . '</span>.<br><br>';
			array_push($res['err'], $startName);
			array_push($res['err'], $endName);
			array_push($res['err'], $diffName);
			return $res;
		} else {
			$res['valid'] = TRUE;
			return $res;
		}
	} // end of "chkStartEndDiff"

// ==== main ==================================================================
// ============================================================================
	define("MAX_DIFFERENCE", 100);

	$colStart = chkParam($_GET["cMin"], "Column Start");
	$colEnd = chkParam($_GET["cMax"], "Column End");
	$rowStart = chkParam($_GET["rMin"], "Row Start");
	$rowEnd = chkParam($_GET["rMax"], "Row End");

	if($colStart['valid'] === TRUE && $colEnd['valid'] === TRUE){
		$colDiff = chkStartEndDiff($colStart['data'], $colEnd['data'], "Column Start", "Column End", "Column Difference");
	}
	if($rowStart['valid'] === TRUE && $rowEnd['valid'] === TRUE){
		$rowDiff = chkStartEndDiff($rowStart['data'], $rowEnd['data'], "Row Start", "Row End", "Row Difference");
	}
	$data = array(
		'err' => array(),
		'qed' => ""
	);

	if($colStart['valid'] === FALSE){
		$data['qed'] .= $colStart['data'];
		array_push($data['err'], $colStart['err']);
	}

	if($colEnd['valid'] === FALSE){
		$data['qed'] .= $colEnd['data'];
		array_push($data['err'], $colEnd['err']);
	}

	if($rowStart['valid'] === FALSE){
		$data['qed'] .= $rowStart['data'];
		array_push($data['err'], $rowStart['err']);
	}

	if($rowEnd['valid'] === FALSE){
		$data['qed'] .= $rowEnd['data'];
		array_push($data['err'], $rowEnd['err']);
	}

	if($colDiff['valid'] === FALSE){
		$data['qed'] .= $colDiff['data'];
		foreach($colDiff['err'] as $e){
			if(!in_array($e, $data['err'])){
				array_push($data['err'], $e);
			}
		}
	}

	if($rowDiff['valid'] === FALSE){
		$data['qed'] .= $rowDiff['data'];
		foreach($rowDiff['err'] as $e){
			if(!in_array($e, $data['err'])){
				array_push($data['err'], $e);
			}
		}
	}
	
	if(count($data['err']) === 0){
		$colStart = $colStart['data'];
		$colEnd = $colEnd['data'];
		$rowStart = $rowStart['data'];
		$rowEnd = $rowEnd['data'];

		$colCounter = 1;
		$rowCounter = 1;

		$data['qed'] .= '<thead class="famt__thead"><tr id="tr" class="famt__tr">';
		$data['qed'] .= '<th class="famt__th row' . $rowCounter . 
			' col' . $colCounter . ' famt--php">Server</th>';
		++$colCounter;

		// Check whether to increment or decrement starting at $colStart value.
		if($colStart > $colEnd){
			for($i = $colStart; $i >= $colEnd; --$i){
				$data['qed'] .= '<th class="famt__th row' . $rowCounter . 
					' col' . $colCounter . '">' . $i . '</th>';
				++$colCounter;
			} // end of for()
		} else {
			for($i = $colStart; $i <= $colEnd; ++$i){
				$data['qed'] .= '<th class="famt__th row' . $rowCounter . 
					' col' . $colCounter . '">' . $i . '</th>';
				++$colCounter;
			} // end of for()
		}

		++$rowCounter;
		$data['qed'] .= '</tr></thead>';
		$data['qed'] .= '<tbody id="famtBody" class="famt__tbody">';

		// Check whether to increment or decrement starting at $rowStart.
		if($rowStart > $rowEnd){
			for($j = $rowStart; $j >= $rowEnd; --$j){
				$colCounter = 1;
				$data['qed'] .= '<tr class="famt__tr">';
				$data['qed'] .= '<th class="famt__th row' . $rowCounter . 
					' col' . $colCounter . '">' . $j . '</td>';
				++$colCounter;

				if($colStart > $colEnd){
					for($k = $colStart; $k >= $colEnd; --$k){
						$data['qed'] .= '<td class="famt__td row' . 
							$rowCounter . ' col' . $colCounter . '">' . $j * $k . '</td>';
						++$colCounter;
					} // end of for()
				} else {
					for($k = $colStart; $k <= $colEnd; ++$k){
						$data['qed'] .= '<td class="famt__td row' . 
							$rowCounter .' col' . $colCounter . '">' . $j * $k . '</td>';
						++$colCounter;
					} // end of for()
				}
				++$rowCounter;
				$data['qed'] .= '</tr>';
			} // end of for()
			$data['qed'] .= '</tbody>';
		} else {
			for($j = $rowStart; $j <= $rowEnd; ++$j){
				$colCounter = 1;
				$data['qed'] .= '<tr class="famt__tr">';
				$data['qed'] .= '<th class="famt__th row' . $rowCounter . 
					' col' . $colCounter . '">' . $j . '</td>';
				++$colCounter;

				if($colStart > $colEnd){
					for($k = $colStart; $k >= $colEnd; --$k){
						$data['qed'] .= '<td class="famt__td row' . $rowCounter
							. ' col' . $colCounter . '">' . $j * $k . '</td>';
						++$colCounter;
					} // end of for()
				} else {
					for($k = $colStart; $k <= $colEnd; ++$k){
						$data['qed'] .= '<td class="famt__td row' . $rowCounter
							. ' col' . $colCounter . '">' . $j * $k . '</td>';
						++$colCounter;
					} // end of for()
				}
				++$rowCounter;
				$data['qed'] .= '</tr>';
			} // end of for()
			$data['qed'] .= '</tbody>';
		}

	}
	echo(json_encode($data));
?>
