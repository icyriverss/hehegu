--insert--
CREATE TRIGGER ins_hq_m_member ON t_hq_m_member
FOR insert AS
	DECLARE @int_basedata int
	set @int_basedata=(select ins.int_basedata from inserted ins)
	select @int_basedata
	IF  NOT (@int_basedata>0)

  BEGIN
    INSERT INTO tmp_hq_m_member
    (
		log_type,
		
		vch_memberno,
		vch_member,
		ch_typeno,
		vch_id,
		dt_birthday,
		vch_tel,
		vch_handtel,
		vch_address,
		dt_limit,
		ch_state,
		num_limit,
		ch_cardflag,
		vch_cardno,
		vch_password,
		vch_operID,
		dt_operdate,
		dt_lastupdatetime,
		int_basedata,
		dt_sendtime,
		ch_send_branchno,
		ch_upflag,
		vch_sex,
		bth_flag,
		dt_build,
		
		add_source,
		add_main)
         SELECT 'INS', 
			ins.vch_memberno,
			ins.vch_member,
			ins.ch_typeno,
			ins.vch_id,
			ins.dt_birthday,
			ins.vch_tel,
			ins.vch_handtel,
			ins.vch_address,
			ins.dt_limit,
			ins.ch_state,
			ins.num_limit,
			ins.ch_cardflag,
			ins.vch_cardno,
			ins.vch_password,
			ins.vch_operID,
			ins.dt_operdate,
			ins.dt_lastupdatetime,
			ins.int_basedata,
			ins.dt_sendtime,
			ins.ch_send_branchno,
			ins.ch_upflag,
			ins.vch_sex,
			ins.bth_flag,
			ins.dt_build,
			'1','0'
         FROM inserted ins
   END 

